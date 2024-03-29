import { Controller, Post, Get, Patch, Body, Param, Query, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { GetTestWordsResponseDto } from './dto/get-test-words-response.dto';
import { TestService } from './test.service';
import { GetTestWordsQueryDto } from './dto/get-test-words-query.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('test')
@Controller({path: 'test'})
export class TestController {
    constructor(private readonly testService: TestService) {}

    @Get('words')
    @ApiOperation({ summary: '테스트 단어 조회', description: '' })
    @ApiResponse({ status: 200, description: 'OK', type: GetTestWordsResponseDto})
    // @ApiResponse({ status: 403, description: 'Forbidden.'})
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true }))
    async getTestWords(
        @Query() query: GetTestWordsQueryDto
    ) {
        return await this.testService.getTestWords(query);
    }
}