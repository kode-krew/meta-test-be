import {
  GetCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
  UpdateCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseError } from 'src/core/errors/database-error';
import { UserType } from 'src/types/userType';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';

export interface UserInfo {
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
  constructor(@Inject('DYNAMODB') private dynamoDb) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
  }

  async findAllUsers(): Promise<User[]> {
    try {
      // 먼저 모든 데이터를 가져와서 로그로 확인
      const allData: ScanCommandOutput = await this.dynamoDb.scan({
        TableName: this.tableName,
      });
      console.log('All DynamoDB data:', JSON.stringify(allData.Items, null, 2));

      // 그 다음 UserInfo 데이터만 필터링
      const result: ScanCommandOutput = await this.dynamoDb.scan({
        TableName: this.tableName,
        FilterExpression: 'attribute_exists(email)',
      });

      console.log(
        'Filtered UserInfo data:',
        // JSON.stringify(result.Items, null, 2),
        result.Items,
      );

      if (!result.Items || result.Items.length === 0) {
        console.log('No users found in DynamoDB');
        return [];
      }

      return result.Items.map((item) => ({
        id: item.PK,
        email: item.email,
        nickname: item.nickname,
        password: item.password,
      }));
    } catch (e) {
      console.error('Error in findAllUsers:', e);
      throw new DatabaseError();
    }
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

  async create(userInfo: UserInfo, userType: UserType): Promise<UserInfo> {
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
      userType,
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
  ): Promise<any> {
    const sortKeyPrefix = level === 'all' ? 'Test_' : `Test_${level}_`;
    const scanIndexForward = order === 'asc';

    const params = {
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
      ExclusiveStartKey: startKey, // previous last key
      ScanIndexForward: scanIndexForward,
    };

    try {
      const result = await this.dynamoDb.query(params);

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
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
              'base64',
            )
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
