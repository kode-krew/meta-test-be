import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateTokenResponseDto } from './dto/create-token-response.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { UserService } from '../user/user.service';
import { CreateUserInfoResponseDto } from '../user/dto/create-user-info-response.dto';
import { UserRepository } from '../user/user.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { generatePassword } from 'src/core/utils/password.util';
import { sesClient } from 'src/core/config/aws.config';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { readHtmlFile } from 'src/core/utils/read-html-file.util';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private userService: UserService,
    private userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.authRepository.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(
    userInfo: CreateTokenRequestDto,
  ): Promise<CreateTokenResponseDto> {
    const user = await this.validateUser(userInfo.email, userInfo.password);

    if (!user) {
      throw new UnauthorizedException(
        'User not found or password does not match',
      );
    }

    // JWT 토큰 생성
    const payload = { id: user.PK };
    return {
      access_token: this.jwtService.sign({ ...payload, isRefreshToken: false }),
      refresh_token: this.jwtService.sign(
        { ...payload, isRefreshToken: true },
        { expiresIn: '30d' },
      ),
    };
  }

  async refreshToken(
    refreshTokenInfoDto: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    let payload;
    const refreshToken = refreshTokenInfoDto.refresh_token;

    try {
      payload = this.jwtService.verify(refreshToken);

      if (!payload.isRefreshToken) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    // JWT 토큰 생성
    payload = { id: payload.id };
    return {
      access_token: this.jwtService.sign({ ...payload, isRefreshToken: false }),
      refresh_token: this.jwtService.sign(
        { ...payload, isRefreshToken: true },
        { expiresIn: '30d' },
      ),
    };
  }

  async OAuthLogin(
    socialLoginDto: SocialLoginRequestDto,
  ): Promise<CreateTokenResponseDto | CreateUserInfoResponseDto> {
    const { email, password } = socialLoginDto;

    const user = await this.validateUser(email, password);

    if (user) {
      //1.기존 가입 유저라면, token create
      return await this.create({ email, password });
    }
    //2. 신규 유저라면 회원가입
    return await this.userService.create({ email, password });
  }

  async sendEmail(
    recipient: string,
    subject: string,
    body: string,
  ): Promise<void> {
    const params = {
      Source: process.env.AWS_SES_EMAIL,
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      await sesClient.send(command);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }

  async resetUserPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.PK, { password: hashedPassword });
    console.log('newPassword:', newPassword);
    // 사용자에게 이메일 전송
    const htmlContent = readHtmlFile(
      join(__dirname, '../../../static/templates/password-reset-email.html'),
      { newPassword },
    );

    await this.sendEmail(
      email,
      '[Metacognition] Your password has been reset',
      htmlContent,
    );
  }
}
