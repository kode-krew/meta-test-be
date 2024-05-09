import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';
import { DatabaseError } from 'src/core/errors/database-error';
import { UserType } from 'src/types/userType';

@Injectable()
export class UserRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    this.tableName = process.env.AWS_DYNAMODB_TABLE_NAME;
  }

  async findOneById(id: string): Promise<any> {
    try {
      const result = await this.dynamoDb.get({
        TableName: this.tableName,
        Key: {
          PK: id,
          SK: `UserInfo#${id}`,
        },
      });
      const { Item, ...$metadata } = result;
      return Item;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async findOneByEmailAndUserType(
    email: string,
    userType: UserType,
  ): Promise<any> {
    try {
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
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async create(userInfo: any): Promise<any> {
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

  async update(id: string, userInfo: any): Promise<any> {
    // Building the update expression
    let updateExpression = 'set';
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    for (const property in userInfo) {
      updateExpression += ` #${property} = :${property},`;
      ExpressionAttributeNames[`#${property}`] = property;
      ExpressionAttributeValues[`:${property}`] = userInfo[property];
    }
    updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma

    try {
      const result = await this.dynamoDb.update({
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

      return result.Attributes;
    } catch (e) {
      throw new DatabaseError();
    }
  }

  async findUserTestList(
    id: string,
    limit: number,
    order: string,
    level: string,
    startKey?: any,
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

  async findUserTest(id: string, sort_key: string): Promise<any> {
    try {
      const result = await this.dynamoDb.get({
        TableName: this.tableName,
        Key: {
          PK: id,
          SK: sort_key,
        },
      });
      const { Item, ...$metadata } = result;
      return Item;
    } catch (e) {
      throw new DatabaseError();
    }
  }
}
