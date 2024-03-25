import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInfoDto } from './dto/create-user-info.dto';

@Controller({path: 'users'})
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getUser(@Param('id') id: string){
    return await this.userService.getUserById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserInfoDto: CreateUserInfoDto){
    return await this.userService.create(createUserInfoDto);
    }
}