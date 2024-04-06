import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TestService } from './test.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateTestRequestDto } from './dto/create-test-request.dto';
import { CreateTestResponseDto } from './dto/create-test-response.dto';

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
  // @ApiResponse({ status: 400, description: 'Bad request'})
  @HttpCode(HttpStatus.CREATED)
  async createUserTest(@Body() createTestRequestDto: CreateTestRequestDto) {
    return await this.testService.createTest(createTestRequestDto);
  }
}
