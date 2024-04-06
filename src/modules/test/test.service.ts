import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TestRepository } from './test.repository';
import { CreateTestRequestDto } from './dto/create-test-request.dto';
import { CreateTestResponseDto } from './dto/create-test-response.dto';

@Injectable()
export class TestService {
  constructor(private testRepository: TestRepository) {}

  async createTest(data: CreateTestRequestDto): Promise<any> {
    const item = await this.testRepository.createTest(data);

    const responseItem = {
      id: item.PK,
      ...item,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    return responseItem;
  }
}
