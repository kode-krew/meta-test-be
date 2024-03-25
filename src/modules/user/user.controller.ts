import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserInfoDto } from './dto/create-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/create-user-info-response.dto';
import { GetUserInfoResponseDto } from './dto/get-user-info-response.dto';

@ApiTags('users')
@Controller({path: 'users'})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @ApiResponse({ status: 200, description: 'OK', type: GetUserInfoResponseDto})
    // @ApiResponse({ status: 403, description: 'Forbidden.'})
    @HttpCode(HttpStatus.OK)
    async getUser(@Param('id') id: string){
    return await this.userService.getUserById(id);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'Created', type: CreateUserInfoResponseDto})
    // @ApiResponse({ status: 400, description: 'Bad request'})
    
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserInfoDto: CreateUserInfoDto){
    return await this.userService.create(createUserInfoDto);
    }
}