import { v4 as uuidv4 } from 'uuid';
import { Injectable, Inject } from '@nestjs/common';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

@Injectable()
export class UserRepository {
  private tableName: string;
  constructor(@Inject('DYNAMODB') private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === 'dev' ? 'Dev_' : '') + 'UserInfoTest';
  }

  async findOneById(id: string): Promise<any> {
    const result = await this.dynamoDb.get({
      TableName: this.tableName,
      Key: { 
        Id: id
      },
    });
    return result.Item;
  }

  async create(userInfo: any): Promise<any> {
    const id = uuidv4();
    const item = {
      ...userInfo,
      Id: id,
      SortKey: `UserInfo#${id}`
    }
    
    await this.dynamoDb.put({
      TableName: this.tableName,
      Item: item
    });
    return item;
  }
  
}
