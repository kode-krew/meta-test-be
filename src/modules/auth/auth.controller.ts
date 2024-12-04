import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.auth.guard';
import { AuthService } from './auth.service';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { SocialLoginRequestDto } from './dto/social-login-request.dto';
import { GoogleAuthGuard } from 'src/auth/guard/google.auth.guard';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { EmailVerificationRequestDto } from './dto/email-verification-request.dto';
import { UpdateEmailVerificationRequestDto } from './dto/update-email-verification-request.dto';
import { UserType } from 'src/types/userType';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  @HttpCode(HttpStatus.CREATED)
  async createToken(
    @Body() createTokenInfoDto: CreateTokenRequestDto,
    @Res() res: Response,
  ) {
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
  @HttpCode(HttpStatus.OK)
  async updateUserPassword(@Body() body: ResetPasswordRequestDto) {
    const email = body.email;
    return await this.authService.resetUserPassword(email, UserType.NORMAL);
  }

  @Post('email-verification')
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
  @HttpCode(HttpStatus.OK)
  async updateEmailVerificaiton(
    @Body() body: UpdateEmailVerificationRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { request_id, code } = body;
    await this.authService.updateEmailVerificaiton(request_id, code);
    res.status(HttpStatus.OK).send();
  }
}
