import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthRepository {
  private tableName: string;
  private emailVerificationTableName: string;

  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
    this.emailVerificationTableName =
      process.env.AWS_DYNAMODB_EMAIL_VERIFICATION_TABLE_NAME;
  }

  async findOneByEmail(email: string): Promise<any> {
    const result = await this.dynamoDb.query({
      TableName: this.tableName,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    });

    return result.Items ? result.Items[0] : null;
  }

  async createEmailAuthentication(email: string): Promise<any> {
    const id = uuidv4();
    const now = new Date();
    const createdAt = now.toISOString();

    // 만료일: 현재 시간(now) 기준으로 24시간 후
    now.setHours(now.getHours() + 24);
    const expireAt = now.toISOString();

    const item = {
      PK: id,
      email,
      is_verified: false,
      createdAt,
      expireAt,
    };

    await this.dynamoDb.put({
      TableName: this.emailVerificationTableName,
      Item: item,
    });

    return item;
  }
}
