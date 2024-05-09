import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { calculateScoreAndCorrectWords } from 'src/core/utils/calculate-score-and-correct-words.util';
import { DatabaseError } from 'src/core/errors/database-error';

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
    const level = data.level;
    const item = {
      PK: id,
      SK: `Test_${level}_${createdAt}`,
      ...data,
      ...testResult,
      category,
      createdAt,
    };
    try {
      await this.dynamoDb.put({
        TableName: this.tableName,
        Item: item,
      });

      return item;
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
