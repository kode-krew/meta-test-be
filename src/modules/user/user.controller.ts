import { Controller, Request, Post, Get, Patch, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/create-user-info-response.dto';
import { GetUserInfoResponseDto } from './dto/get-user-info-response.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';
import { UpdateUserInfoResponseDto } from './dto/update-user-info-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller({path: 'users'})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '유저 정보 조회', description: '' })
    @ApiResponse({ status: 200, description: 'OK', type: GetUserInfoResponseDto})
    // @ApiResponse({ status: 403, description: 'Forbidden.'})
    @HttpCode(HttpStatus.OK)
    async getUser(@Request() req){
        const id = req.user.Id;
        return await this.userService.getUserById(id);
    }

    @Post()
    @ApiOperation({ summary: '회원가입', description: '유저 정보 등록' })
    @ApiResponse({ status: 201, description: 'Created', type: CreateUserInfoResponseDto})
    // @ApiResponse({ status: 400, description: 'Bad request'})
    
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserInfoDto: CreateUserInfoRequestDto){
    return await this.userService.create(createUserInfoDto);
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: '유저 정보 수정', description: '' })
    @ApiResponse({ status: 200, description: 'OK', type: UpdateUserInfoResponseDto})
    // @ApiResponse({ status: 400, description: 'Bad request'})
    
    @HttpCode(HttpStatus.OK)
    async updateUser(@Request() req, @Body() updateUserInfoDto: UpdateUserInfoRequestDto){
        const id = req.user.Id;
        return await this.userService.update(id, updateUserInfoDto);
    }
}