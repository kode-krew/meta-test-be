import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestRequestDto } from './dto/create-test-request.dto';

@Controller({ path: 'test' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUserTest(@Body() createTestRequestDto: CreateTestRequestDto) {
    return await this.testService.createTest(createTestRequestDto);
  }
}
