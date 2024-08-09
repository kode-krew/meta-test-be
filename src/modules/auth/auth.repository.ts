import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from 'src/types/userType';
import { generateAuthcode } from 'src/core/utils/authentication-code.util';

@Injectable()
export class AuthRepository {
  private tableName: string;
  private emailVerificationTableName: string;

  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
    this.emailVerificationTableName =
      process.env.AWS_DYNAMODB_EMAIL_VERIFICATION_TABLE_NAME;
  }

  async findOneByEmailAndUserType(
    email: string,
    userType: UserType,
  ): Promise<any> {
    const result = await this.dynamoDb.query({
      TableName: this.tableName,
      IndexName: 'email-userType-index',
      KeyConditionExpression: 'email = :email AND userType = :userType',
      ExpressionAttributeValues: {
        ':email': email,
        ':userType': userType,
      },
    });

    return result.Items ? result.Items[0] : null;
  }

  async createEmailAuthentication(email: string): Promise<any> {
    const id = uuidv4();
    const now = new Date();
    const createdAt = now.toISOString();
    const code = generateAuthcode(4);

    // 만료일: 현재 시간(now) 기준으로 24시간 후
    now.setHours(now.getHours() + 24);
    const expireAt = now.toISOString();

    const item = {
      PK: id,
      email,
      is_verified: false,
      code,
      createdAt,
      expireAt,
    };

    await this.dynamoDb.put({
      TableName: this.emailVerificationTableName,
      Item: item,
    });

    return item;
  }

  async findOneByEmailVerificaitonId(id: string): Promise<any> {
    const result = await this.dynamoDb.get({
      TableName: this.emailVerificationTableName,
      Key: {
        PK: id,
      },
    });
    const { Item, ...$metadata } = result;
    return Item;
  }

  async updateEmailVerificaitonId(id: string): Promise<any> {
    const result = await this.dynamoDb.update({
      TableName: this.emailVerificationTableName,
      Key: {
        PK: id,
      },
      UpdateExpression: 'set is_verified = :v',
      ExpressionAttributeValues: {
        ':v': true,
      },
    });

    return true;
  }

  async findEmailVerificationByEmail(email: string): Promise<any> {
    const result = await this.dynamoDb.query({
      TableName: this.emailVerificationTableName,
      IndexName: 'email-createdAt-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
      ScanIndexForward: false, // order by desc
      Limit: 1, // latest
    });

    if (result.Items.length === 0) {
      return null;
    }

    return result.Items[0];
  }
}
