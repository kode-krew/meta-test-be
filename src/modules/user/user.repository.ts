import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === 'dev' ? 'Dev_' : '') + 'UserInfoTest';
  }

  async findOneById(id: string): Promise<any> {

    const result = await this.dynamoDb.get({
      // TableName: this.tableName,
      TableName: this.tableName,
      Key: { 
        Id: id,
        SortKey: `UserInfo#${id}`
      },
    });
    const { Item, ...$metadata } = result;
    return Item;
  }

  async create(userInfo: any): Promise<any> {
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    const item = {
      ...userInfo,
      password: hashedPassword,
      Id: id,
      SortKey: `UserInfo#${id}`
    }

    await this.dynamoDb.put({
      TableName: this.tableName,
      Item: item
    });

    return item;
  }
  
  async update(id: string, userInfo: any): Promise<any> {
    
    // Building the update expression
    let updateExpression = 'set';
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    for (const property in userInfo) {
      updateExpression += ` #${property} = :${property},`;
      ExpressionAttributeNames[`#${property}`] = property;
      ExpressionAttributeValues[`:${property}`] = userInfo[property];
    }
    updateExpression = updateExpression.slice(0, -1); // Remove the trailing comma

    const result = await this.dynamoDb.update({
      TableName: this.tableName,
      Key: { 
        Id: id, 
        SortKey: `UserInfo#${id}` 
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      ReturnValues: "ALL_NEW" // return updated all data
    })

    return result.Attributes;
  }

}
