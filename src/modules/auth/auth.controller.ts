import { Controller, Post, Get, Patch, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { CreateTokenResponseDto } from './dto/create-token-response.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token-response.dto'
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller({path: 'auth'})
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('token')
    @ApiOperation({ summary: '로그인', description: '토큰 발급' })
    @ApiResponse({ status: 201, description: 'Created', type: CreateTokenResponseDto})
    // @ApiResponse({ status: 400, description: 'Bad request'})
    
    @HttpCode(HttpStatus.OK)
    async createToken(@Body() createTokenInfoDto: CreateTokenRequestDto){
    return await this.authService.create(createTokenInfoDto);
    }

    @Post('token/refresh')
    @ApiOperation({ summary: '토큰 재발급', description: '토큰 재발급' })
    @ApiResponse({ status: 201, description: 'Created', type: RefreshTokenResponseDto})
    // @ApiResponse({ status: 400, description: 'Bad request'})
    
    @HttpCode(HttpStatus.OK)
    async refreshToken(@Body() refreshTokenInfoDto: RefreshTokenRequestDto){
    return await this.authService.refreshToken(refreshTokenInfoDto);
    }
}