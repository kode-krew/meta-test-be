import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { calculateScoreAndCorrectWords } from 'src/core/utils/calculate-score-and-correct-words.util';

@Injectable()
export class TestRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
  }

  async createTest(data: any): Promise<any> {
    let id = data.id;

    if (!id) {
      id = uuidv4();
    }

    const testResult = calculateScoreAndCorrectWords(data);
    const createdAt = new Date().toISOString();
    const category = 'test';
    const item = {
      PK: id,
      SK: `Test#${createdAt}`,
      ...data,
      ...testResult,
      category,
      createdAt,
    };

    await this.dynamoDb.put({
      TableName: this.tableName,
      Item: item,
    });

    return item;
  }
}
