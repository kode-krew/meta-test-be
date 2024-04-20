import { Injectable } from '@nestjs/common';
import { TestRepository } from './test.repository';
import { CreateTestRequestDto } from './dto/http/create-test-request.dto';

@Injectable()
export class TestService {
  constructor(private testRepository: TestRepository) {}

  async createTest(data: CreateTestRequestDto): Promise<any> {
    const item = await this.testRepository.createTest(data);

    const responseItem = {
      id: item.PK,
      sort_key: item.SK,
    };

    return responseItem;
  }
}
