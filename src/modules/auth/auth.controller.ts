import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.auth.guard';
import { AuthService } from './auth.service';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { CreateTokenResponseDto } from './dto/create-token-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { GoogleAuthGuard } from 'src/auth/guard/google.auth.guard';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { EmailVerificationRequestDto } from './dto/email-verification-request.dto';
import { UpdateEmailVerificationRequestDto } from './dto/update-email-verification-request.dto';
import { UserType } from 'src/types/userType';
import { CreateTokenBadRequestError } from './error/create-token-error';

@ApiTags('auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @ApiOperation({ summary: '로그인', description: '토큰 발급' })
  @ApiResponse({
    status: 201,
    description: 'Created(access_token, refresh_token in the header)',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: CreateTokenBadRequestError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  async createToken(
    @Body() createTokenInfoDto: CreateTokenRequestDto,
    @Res() res: Response,
  ) {
    //NOTE: 이 API가 호출되는 유저는 일반 유저이므로 userType = NORMAL
    const tokens = await this.authService.create(
      createTokenInfoDto,
      UserType.NORMAL,
    );
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Access_Token, Refresh_Token',
    );
    res.setHeader('Access_token', tokens.access_token);
    res.setHeader('Refresh_token', tokens.refresh_token);

    res.status(HttpStatus.CREATED).send();
  }

  @Post('token/refresh')
  @ApiOperation({
    summary: '토큰 재발급',
    description: '토큰 재발급',
  })
  @ApiResponse({
    status: 201,
    description: 'Created(access_token, refresh_token in the header)',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: RefreshTokenRequestDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          message: 'Invalid token',
          error: 'Unauthorized',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  async refreshToken(
    @Body() refreshTokenInfoDto: RefreshTokenRequestDto,
    @Res() res: Response,
  ) {
    const tokens = await this.authService.refreshToken(refreshTokenInfoDto);
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Access_Token, Refresh_Token',
    );
    res.setHeader('access_token', tokens.access_token);
    res.setHeader('refresh_token', tokens.refresh_token);

    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({
    summary: '카카오 소셜로그인',
    description: '기가입 유저는 로그인, 신규 유저는 회원가입 진행',
  })
  @ApiResponse({
    status: 201,
    description: 'Created(access_token, refresh_token in the header)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    content: {
      'application/json': {
        example: {
          message: 'User exists',
          error: 'Conflict',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('login/kakao')
  async loginWithKakao(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req['user'] as SocialLoginRequestDto;
    const tokens = await this.authService.OAuthLogin(user, UserType.KAKAO);
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Access_Token, Refresh_Token',
    );
    res.setHeader('Access_token', tokens.access_token);
    res.setHeader('Refresh_token', tokens.refresh_token);
    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({
    summary: '구글 소셜로그인',
    description: '기가입 유저는 로그인, 신규 유저는 회원가입 진행',
  })
  @ApiResponse({
    status: 201,
    description: 'Created(access_token, refresh_token in the header)',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    content: {
      'application/json': {
        example: {
          message: 'User exists',
          error: 'Conflict',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @UseGuards(GoogleAuthGuard)
  @Get('login/google')
  async loginWithGoogle(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req['user'] as SocialLoginRequestDto;
    const tokens = await this.authService.OAuthLogin(user, UserType.GOOGLE);
    res.setHeader(
      'Access-Control-Expose-Headers',
      'Access_Token, Refresh_Token',
    );
    res.setHeader('Access_token', tokens.access_token);
    res.setHeader('Refresh_token', tokens.refresh_token);
    res.status(HttpStatus.CREATED).send();
  }

  @Patch('password')
  @ApiOperation({
    summary: '비밀번호 초기화',
    description: '비밀번호 변경하고 이메일로 전송합니다.',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.OK)
  async updateUserPassword(@Body() body: ResetPasswordRequestDto) {
    const email = body.email;
    return await this.authService.resetUserPassword(email);
  }

  @Post('email-verification')
  @ApiOperation({
    summary: '이메일 인증 요청',
    description: '이메일 인증 요청 메일을 발송',
  })
  @ApiResponse({
    status: 201,
    description: 'Created',
  })
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.CREATED)
  async createEmailVerificaiton(@Body() body: EmailVerificationRequestDto) {
    const email = body.email;
    return await this.authService.createEmailVerificaiton(email);
  }

  @Patch('email-verification')
  @ApiOperation({
    summary: '이메일 인증 검증',
    description: '임시토큰으로 이메일 인증을 검증',
  })
  @ApiResponse({
    status: 200,
    description: 'OK',
  })
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.OK)
  async updateEmailVerificaiton(
    @Body() body: UpdateEmailVerificationRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = body.token;
    await this.authService.updateEmailVerificaiton(token);
    res.status(HttpStatus.OK).send();
  }
}
