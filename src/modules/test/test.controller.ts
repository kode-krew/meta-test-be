import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateTestRequestDto } from './dto/create-test-request.dto';
import { CreateTestResponseDto } from './dto/create-test-response.dto';
import { CreateTestRequestBodyBadRequestError } from './error/create-test-errror';

@ApiTags('test')
@Controller({ path: 'test' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @ApiOperation({ summary: '테스트 결과 등록', description: '' })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: CreateTestResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: CreateTestRequestBodyBadRequestError,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  async createUserTest(@Body() createTestRequestDto: CreateTestRequestDto) {
    return await this.testService.createTest(createTestRequestDto);
  }
}
