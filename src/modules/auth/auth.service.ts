import { Injectable } from '@nestjs/common';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateTokenResponseDto } from './dto/create-token-response.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { generatePassword } from 'src/core/utils/password.util';
import { sesClient } from 'src/core/config/aws.config';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import { readHtmlFile } from 'src/core/utils/read-html-file.util';
import { join } from 'path';
import { jwtConstants } from 'src/core/config/jwt';
import { UserType } from 'src/types/userType';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
    private userService: UserService,
    private userRepository: UserRepository,
  ) {}

  async validateUser(
    email: string,
    password: string,
    userType: UserType,
  ): Promise<any> {
    //NOTE: email & userType까지 동일해야 동일 유저
    console.log(email, password, userType, 'validateUser');
    const user = await this.authRepository.findOneByEmailAndUserType(
      email,
      userType,
    );

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async create(
    userInfo: CreateTokenRequestDto,
    userType: UserType,
  ): Promise<CreateTokenResponseDto> {
    const user = await this.validateUser(
      userInfo.email,
      userInfo.password,
      userType,
    );

    if (!user) {
      throw new UnauthorizedException(
        'User not found or password does not match',
      );
    }

    return await this.createToken(user);
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
    userType: UserType,
  ): Promise<CreateTokenResponseDto> {
    const { email, password } = socialLoginDto;
    console.log(email, password, userType, 'socialLoginDto');

    const user = await this.validateUser(email, password, userType);

    console.log(user, 'user');
    if (user) {
      //1.기존 가입 유저라면, token create
      return await this.createToken(user);
    }

    //2. 신규 유저라면 회원가입 후 token create
    const newUser = await this.userService.create(
      { email, password },
      userType,
    );
    console.log(newUser, 'newUser');
    return await this.createToken(newUser);
  }

  async createToken(user: any) {
    // JWT 토큰 생성
    const payload = { id: user.PK };
    return {
      access_token: this.jwtService.sign({ ...payload, isRefreshToken: false }),
      refresh_token: this.jwtService.sign(
        { ...payload, isRefreshToken: true },
        { expiresIn: jwtConstants.refreshTokenExpiresIn },
      ),
    };
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
    } catch (error) {
      console.error('Error sending email', error);
      throw error;
    }
  }

  async resetUserPassword(email: string, userType: UserType): Promise<void> {
    const user = await this.userRepository.findOneByEmailAndUserType(
      email,
      userType,
    );
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.update(user.PK, { password: hashedPassword });

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

  async createEmailVerificaiton(email: string): Promise<string> {
    const item = await this.authRepository.createEmailAuthentication(email);
    const code = item.code;

    // 사용자에게 이메일 전송
    const htmlContent = readHtmlFile(
      join(__dirname, '../../../static/templates/verification-email.html'),
      { code },
    );

    await this.sendEmail(
      email,
      '[Metacognition] Email address verification request',
      htmlContent,
    );

    return item.PK;
  }

  async updateEmailVerificaiton(id: string, code: number): Promise<void> {
    const item = await this.authRepository.findOneByEmailVerificaitonId(id);
    if (!item) {
      throw new UnauthorizedException('Invalid request_id');
    }

    if (Number(item.code) !== code) {
      throw new UnauthorizedException('Invalid code');
    }

    const now = new Date();
    const expirationDate = new Date(item.expireAt);

    if (item.is_verified || expirationDate < now) {
      throw new UnauthorizedException('Expired request_id');
    }

    return await this.authRepository.updateEmailVerificaitonId(id);
  }
}
