import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument, QueryCommandOutput, GetCommandOutput, UpdateCommandOutput, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';
import { DatabaseError } from 'src/core/errors/database-error';
import { UserType } from 'src/types/userType';
import { User } from './entities/user.entity';

interface UserInfo {
  id?: string;
  email: string;
  password: string;
  PK?: string;
  SK?: string;
}

interface UserTest {
  [key: string]: string;
  PK?: string;
  SK?: string;
}

@Injectable()
export class UserRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
  }

  async findOneById(id: string): Promise<UserInfo | null> {
    try {
      const result: GetCommandOutput = await this.dynamoDb.get({
        TableName: this.tableName,
        Key: {
          PK: id,
          SK: `UserInfo#${id}`,
        },
      });
      return result.Item as UserInfo | null;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async findOneByEmailAndUserType(
    email: string,
    userType: UserType,
  ): Promise<UserInfo | null> {
    try {
      const result: QueryCommandOutput = await this.dynamoDb.query({
        TableName: this.tableName,
        IndexName: 'email-userType-index',
        KeyConditionExpression: 'email = :email AND userType = :userType',
        ExpressionAttributeValues: {
          ':email': email,
          ':userType': userType,
        },
      });

      return result.Items ? (result.Items[0] as UserInfo) : null;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async create(userInfo: UserInfo): Promise<UserInfo> {
    let id = userInfo.id;
    if (!id) {
      id = uuidv4();
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    const createdAt = new Date().toISOString();
    const item = {
      PK: id,
      SK: `UserInfo#${id}`,
      ...userInfo,
      password: hashedPassword,
      createdAt,
    };

    try {
      await this.dynamoDb.put({
        TableName: this.tableName,
        Item: item,
      });

      return item;
    } catch (e) {
      console.error('create error', e, item);
      throw new DatabaseError();
    }
  }

  async update(id: string, userInfo: Partial<UserInfo>): Promise<User | null> {
    let updateExpression = 'set';
    const ExpressionAttributeNames: { [key: string]: string } = {};
    const ExpressionAttributeValues: { [key: string]: unknown } = {};
    for (const property in userInfo) {
      updateExpression += ` #${property} = :${property},`;
      ExpressionAttributeNames[`#${property}`] = property;
      ExpressionAttributeValues[`:${property}`] = userInfo[property];
    }
    updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma

    try {
      const result: UpdateCommandOutput = await this.dynamoDb.update({
        TableName: this.tableName,
        Key: {
          PK: id,
          SK: `UserInfo#${id}`,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: ExpressionAttributeNames,
        ExpressionAttributeValues: ExpressionAttributeValues,
        ReturnValues: 'ALL_NEW', // return updated all data
      });

      return result.Attributes as User | null;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async findUserTestList(
    id: string,
    limit: number,
    order: string,
    level: string,
    startKey?: string,
  ): Promise<{ items: UserTest[], count: number, lastEvaluatedKey: string | null }> {
    const sortKeyPrefix = level === 'all' ? 'Test_' : `Test_${level}_`;
    const scanIndexForward = order === 'asc';

    const params: {
      TableName: string;
      KeyConditionExpression: string;
      ExpressionAttributeNames: { [key: string]: string };
      ExpressionAttributeValues: { [key: string]: string };
      Limit: number;
      ScanIndexForward: boolean;
      ExclusiveStartKey?: { [key: string]: unknown };
    } = {
      TableName: this.tableName,
      KeyConditionExpression: '#pk = :id and begins_with(#sk, :sortKeyPrefix)',
      ExpressionAttributeNames: {
        '#pk': 'PK',
        '#sk': 'SK',
      },
      ExpressionAttributeValues: {
        ':id': id,
        ':sortKeyPrefix': sortKeyPrefix,
      },
      Limit: limit, // pagination limit
      ScanIndexForward: scanIndexForward,
    };

    if (startKey) {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(startKey, 'base64').toString('utf-8'));
    }

    try {
      const result: QueryCommandOutput = await this.dynamoDb.query(params);

      const transformedItems = result.Items.map((item) => {
        const { PK, SK, ...rest } = item;
        return {
          ...rest,
          sort_key: SK, // 'SK' 키를 'sort_key'로 변경
        };
      });

      return {
        items: transformedItems,
        count: result.Count,
        lastEvaluatedKey: result.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64')
          : null,
      };
    } catch (error) {
      throw new DatabaseError();
    }
  }

  async findUserTest(id: string, sort_key: string): Promise<UserTest | null> {
    try {
      const result: GetCommandOutput = await this.dynamoDb.get({
        TableName: this.tableName,
        Key: {
          PK: id,
          SK: sort_key,
        },
      });
      return result.Item as UserTest | null;
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
