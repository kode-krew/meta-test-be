import {
  Controller,
  Request,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/create-user-info-response.dto';
import { GetUserInfoResponseDto } from './dto/get-user-info-response.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';
import { UpdateUserInfoResponseDto } from './dto/update-user-info-response.dto';
import { GetUserTestListQueryDto } from './dto/get-user-test-list-query.dto';
import { GetUserTestListResponseDto } from './dto/get-user-test-list-response.dto';
import { TestLevel, Order } from '../test/test.entity';
import { UnauthorizedError } from 'src/core/errors/unauthorized-error';
import { GetUserInfoNotFoundError } from './error/get-user-info-error';
import { GetUserTestQueryDto } from './dto/get-user-test-query.dto';
import {
  GetUserTestNotFoundError,
  GetUserTestRequestQueryBadRequestError,
} from './error/get-user-test-error';
import { GetUserTestResponseDto } from './dto/get-user-test-response.dto';
import { CreateUserInfoConflictError } from './error/create-user-info-error';
import { GetUserTestListRequestQueryBadRequestError } from './error/get-user-test-list-error';
import { UserType } from 'src/types/userType';

@ApiTags('users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 조회', description: '' })
  @ApiResponse({ status: 200, description: 'OK', type: GetUserInfoResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: GetUserInfoNotFoundError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  async getUser(@Request() req) {
    const id = req.user.id;
    return await this.userService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: '회원가입', description: '유저 정보 등록' })
  @ApiResponse({
    status: 201,
    description: 'Created',
    type: CreateUserInfoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    content: {
      'application/json': {
        examples: {
          CreateUserInfoRequestBodyBadRequestError: {
            value: {
              message: 'Unexpected end of JSON input',
              error: 'Bad Request',
            },
            description: '요청 바디 형식이 맞지 않음',
          },
          CreateUserInfoRequestBodyBadRequestError2: {
            value: {
              message: [
                'email should not be empty',
                'email must be an email',
                'password must be a string',
                'password must be longer than or equal to 8 characters',
              ],
              error: 'Bad Request',
            },
            description: '유효하지 않은 요청 바디',
          },
          CreateUserInfoRequestBodyBadRequestError3: {
            value: {
              message: 'User exists',
              error: 'Bad Request',
            },
            description: '이메일과 매칭되는 유저가 이미 존재함',
          },
          CreateUserInfoRequestBodyBadRequestError4: {
            value: {
              message: 'Invalid email verification',
              error: 'Bad Request',
            },
            description: '올바르지 않은 이메일 검증',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User exists',
    type: CreateUserInfoConflictError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserInfoDto: CreateUserInfoRequestDto) {
    //NOTE: createUser는 일반 유저의 경우만 호출가능
    return await this.userService.create(createUserInfoDto, UserType.NORMAL);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 정보 수정', description: '' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: UpdateUserInfoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    content: {
      'application/json': {
        examples: {
          UpdateUserInfoRequestBodyBadRequestError: {
            value: {
              message: 'At least one of nickname, gender, age is required.',
              error: 'Bad Request',
            },
            description: '적어도 하나의 값이 요구됨',
          },
          UpdateUserInfoRequestBodyBadRequestError2: {
            value: {
              message: [
                'email must be an email',
                'nickname must be a string',
                'age must be a number conforming to the specified constraints',
                'gender must be a string',
              ],
              error: 'Bad Request',
            },
            description: '유효하지 않은 요청 바디',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    content: {
      'application/json': {
        example: {
          message: 'At least one of nickname, gender, age is required.',
          error: 'Bad request',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
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

  @Get('/test/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '유저 테스트 리스트 정보 조회', description: '' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GetUserTestListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: GetUserTestListRequestQueryBadRequestError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  async geteUserTestList(
    @Request() req: any,
    @Query() query: GetUserTestListQueryDto,
  ) {
    const id = req.user.id;
    // set query params
    query.order = query.order || Order.Desc;
    query.level = query.level || TestLevel.All;
    return await this.userService.getUserTestList(id, query);
  }

  @Get('/test/detail/:id')
  @ApiOperation({ summary: '유저 테스트 세부 정보 조회', description: '' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GetUserTestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: GetUserTestRequestQueryBadRequestError,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedError,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
    type: GetUserTestNotFoundError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  async geteUserTest(
    @Param('id') id: string,
    @Query() query: GetUserTestQueryDto,
  ) {
    const { sort_key } = query;
    return await this.userService.getUserTest(id, sort_key);
  }
}
