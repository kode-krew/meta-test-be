import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { TestService } from './test.service';
import { CreateTestRequestDto } from './dto/http/create-test-request.dto';
import { CreateTestResponseDto } from './dto/http/create-test-response.dto';
import { CreateTestErrorRequestBodyBadRequestErrorDto } from './dto/error/create-test-errror.dto';

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
    type: CreateTestErrorRequestBodyBadRequestErrorDto,
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
