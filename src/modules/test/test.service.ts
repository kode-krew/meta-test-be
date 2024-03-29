import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestRepository } from './test.repository';
import { GetTestWordsQueryDto } from './dto/get-test-words-query.dto';

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
}