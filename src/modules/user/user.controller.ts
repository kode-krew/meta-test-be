import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserType } from 'src/types/userType';
import { Order, TestLevel } from '../test/test.entity';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { GetUserTestListQueryDto } from './dto/get-user-test-list-query.dto';
import { GetUserTestQueryDto } from './dto/get-user-test-query.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';
import { UserService } from './user.service';

@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req) {
    const id = req.user.id;
    return await this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() createUserInfoDto: CreateUserInfoRequestDto) {
    //NOTE: createUser는 일반 유저의 경우만 호출가능
    return await this.userService.create(createUserInfoDto, UserType.NORMAL);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Request() req,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    updateUserInfoDto: UpdateUserInfoRequestDto,
  ) {
    const id = req.user.id;
    return await this.userService.update(id, updateUserInfoDto);
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  async geteUserTestList(
    @Request() req,
    @Query() query: GetUserTestListQueryDto,
  ) {
    const id = req.user.id;
    // set query params
    query.order = query.order || Order.Desc;
    query.level = query.level || TestLevel.All;
    return await this.userService.getUserTestList(id, query);
  }

  @Get('/test/:id')
  async geteUserTest(
    @Param('id') id: string,
    @Query() query: GetUserTestQueryDto,
  ) {
    const { sort_key } = query;
    return await this.userService.getUserTest(id, sort_key);
  }
}
