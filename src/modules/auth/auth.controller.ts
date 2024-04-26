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
import { CreateTokenRequestBodyError } from './error/create-token-error';
import { RefreshTokenRequestBodyError } from './error/refresh-token-error';
import { ResetPasswordRequestBodyError } from './error/reset-password-error';
import { EmailVerificationRequestBodyError } from './error/email-verification-error';
import { UpdateEmailVerificationRequestBodyError } from './error/update-email-verification-error';

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
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: CreateTokenRequestBodyError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          message: 'User not found or password does not match',
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
    description: 'Created',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: RefreshTokenRequestBodyError,
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
    description: 'Created',
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
    description: 'Created',
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
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ResetPasswordRequestBodyError,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    content: {
      'application/json': {
        example: {
          message: 'User does not exist',
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  async updateUserPassword(@Body() body: ResetPasswordRequestDto) {
    const email = body.email;
    //NOTE: reset password는 일반유저만 가능(소셜로그인 유저 X)
    return await this.authService.resetUserPassword(email, UserType.NORMAL);
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
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: EmailVerificationRequestBodyError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  async createEmailVerificaiton(
    @Body() body: EmailVerificationRequestDto,
    @Res() res: Response,
  ) {
    const email = body.email;
    const request_id = await this.authService.createEmailVerificaiton(email);
    res.status(HttpStatus.CREATED).send({ request_id });
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
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: UpdateEmailVerificationRequestBodyError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        examples: {
          UpdateEmailVerificationUnauthorizedError: {
            value: {
              message: 'Invalid request_id',
              error: 'Unauthorized',
            },
            description: 'request_id가 유효하지 않음',
          },
          UpdateEmailVerificationUnauthorizedError2: {
            value: {
              message: 'Invalid code',
              error: 'Unauthorized',
            },
            description: 'code가 유효하지 않음',
          },
          UpdateEmailVerificationUnauthorizedError3: {
            value: {
              message: 'Expired request_id',
              error: 'Unauthorized',
            },
            description: 'request_id가 만료됨',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  async updateEmailVerificaiton(
    @Body() body: UpdateEmailVerificationRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = body.request_id;
    const code = body.code;
    await this.authService.updateEmailVerificaiton(id, code);
    res.status(HttpStatus.OK).send();
  }
}
