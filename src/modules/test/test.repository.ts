import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class TestRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === 'dev' ? 'Dev_' : '') + 'Word';
  }

  async getTestWords(lang: string): Promise<any> {
    try {
      const result = await this.dynamoDb.query({
        TableName: this.tableName,
        KeyConditionExpression: 'Id = :id',
        ExpressionAttributeValues: {
          ':id': lang,
        }
      });

      return result.Items;
    } catch (error) {
      console.error('Error querying DynamoDB:', error);
      throw error;
    }
  }

}
