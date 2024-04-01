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

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.authRepository.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(userInfo: CreateTokenRequestDto): Promise<any> {
    const user = await this.validateUser(userInfo.email, userInfo.password);
    if (!user) {
      throw new UnauthorizedException(
        "User not found or password does not match",
      );
    }

    // JWT 토큰 생성
    const payload = { Id: user.Id, SortKey: user.SortKey };
    return {
      access_token: this.jwtService.sign({ ...payload, isRefreshToken: false }),
      refresh_token: this.jwtService.sign(
        { ...payload, isRefreshToken: true },
        { expiresIn: "30d" },
      ),
    };
  }



  async refreshToken(
    refreshTokenInfoDto: RefreshTokenRequestDto,
  ): Promise<any> {
    let payload;
    const refreshToken = refreshTokenInfoDto.refresh_token;

    try {
      payload = this.jwtService.verify(refreshToken);

      if (!payload.isRefreshToken) {
        throw new UnauthorizedException("Invalid token");
      }
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }

    // JWT 토큰 생성
    payload = { Id: payload.Id, SortKey: payload.SortKey };
    return {
      access_token: this.jwtService.sign({ ...payload, isRefreshToken: false }),
      refresh_token: this.jwtService.sign(
        { ...payload, isRefreshToken: true },
        { expiresIn: "30d" },
      ),
    };
  }



  async OAuthLogin(socialLoginDto: SocialLoginRequestDto): Promise<CreateTokenResponseDto> {
    const { email, password } = socialLoginDto;
    // const email = 'test3@email.com';

    return await this.create({ email, password })
  }
}




