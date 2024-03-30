import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestRepository } from './test.repository';
import { GetTestWordsQueryDto } from './dto/get-test-words-query.dto';
import { CreateTestRequestDto } from './dto/create-test-request.dto';

@Injectable()
export class TestService {
  constructor(private testRepository: TestRepository) {}

  async getTestWords(query: GetTestWordsQueryDto): Promise<any> {
    const limit: number = query.limit;
    const lang: string = query.lang;
    const testWords = await this.testRepository.getTestWords(lang);

    const shuffledWords = testWords.sort(() => 0.5 - Math.random());
    return shuffledWords.slice(0, limit);
  }

  async createTest(data: CreateTestRequestDto): Promise<any> {
    const item = await this.testRepository.createTest(data);
    console.log('item:', item);
    const { SortKey, ...result } = item;
    return result
  }
}