import { Controller, Post, Get, Patch, Body, Param, HttpCode, HttpStatus, Res, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { CreateTokenResponseDto } from './dto/create-token-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.auth.guard';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { GoogleAuthGuard } from 'src/auth/guard/google.auth.guard';
import { CreateUserInfoResponseDto } from '../user/dto/create-user-info-response.dto';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: '로그인', description: '토큰 발급' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateTokenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.CREATED)
  async createToken(@Body() createTokenInfoDto: CreateTokenRequestDto, @Res() res: Response) {
    const tokens = await this.authService.create(createTokenInfoDto);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 1h
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
    });
    res.setHeader('access_token', tokens.access_token);
    res.setHeader('refresh_token', tokens.refresh_token);
    return res.status(HttpStatus.CREATED).send();
  }

  @Post('token/refresh')
  @ApiOperation({ summary: '토큰 재발급', description: '토큰 재발급' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: RefreshTokenResponseDto,
  })

  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.CREATED)
  async refreshToken(@Body() refreshTokenInfoDto: RefreshTokenRequestDto, @Res() res: Response) {
    const tokens = await this.authService.refreshToken(refreshTokenInfoDto);

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 1h
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30d
    });
    res.setHeader('access_token', tokens.access_token);
    res.setHeader('refresh_token', tokens.refresh_token);
    return res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: '카카오 소셜로그인', description: '기가입 유저는 로그인, 신규 유저는 회원가입 진행' })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateTokenResponseDto | CreateUserInfoResponseDto> {
    const user = req['user'] as SocialLoginRequestDto;

    return await this.authService.OAuthLogin(user);
  }

  @ApiOperation({ summary: '구글 소셜로그인', description: '기가입 유저는 로그인, 신규 유저는 회원가입 진행' })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async loginWithGoogle(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CreateTokenResponseDto | CreateUserInfoResponseDto> {
    const user = req['user'] as SocialLoginRequestDto;

    return await this.authService.OAuthLogin(user);
  }
}
