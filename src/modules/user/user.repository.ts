import { v4 as uuidv4 } from "uuid";
import { Injectable, Inject } from "@nestjs/common";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserRepository {
  private tableName: string;
  constructor(@Inject("DYNAMODB") private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === "dev" ? "Dev_" : "") + "UserInfoTest";
  }

  async findOneById(id: string): Promise<any> {
    const result = await this.dynamoDb.get({
      // TableName: this.tableName,
      TableName: this.tableName,
      Key: {
        Id: id,
        SortKey: `UserInfo#${id}`,
      },
    });
    const { Item, ...$metadata } = result;
    return Item;
  }

  async findOneByEmail(email: string): Promise<any> {
    const result = await this.dynamoDb.query({
      TableName: this.tableName,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email,
      },
    });
    return result.Items ? result.Items[0] : null;
  }

  async create(userInfo: any): Promise<any> {
    let id = userInfo.Id;
    if (!id) {
      id = uuidv4();
    }

    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    const createdAt = new Date().toISOString();
    const item = {
      Id: id,
      SortKey: `UserInfo#${id}`,
      ...userInfo,
      password: hashedPassword,
      createdAt,
    };

    await this.dynamoDb.put({
      TableName: this.tableName,
      Item: item,
    });

    return item;
  }

  async update(id: string, userInfo: any): Promise<any> {
    // Building the update expression
    let updateExpression = "set";
    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
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
        SortKey: `UserInfo#${id}`,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
      ReturnValues: "ALL_NEW", // return updated all data
    });

    return result.Attributes;
  }

  async findUserTest(id: string, limit: number, startKey?: any): Promise<any> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression:
        "#id = :id and begins_with(#sortKey, :sortKeyPrefix)",
      ExpressionAttributeNames: {
        "#id": "Id",
        "#sortKey": "SortKey",
      },
      ExpressionAttributeValues: {
        ":id": id,
        ":sortKeyPrefix": "Test#",
      },
      Limit: limit, // pagination limit
      ExclusiveStartKey: startKey, // previous last key
      ScanIndexForward: false, // order = desc
    };

    try {
      const result = await this.dynamoDb.query(params);
      return {
        items: result.Items,
        count: result.Count,
        lastEvaluatedKey: result.LastEvaluatedKey
          ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
              "base64",
            )
          : null,
      };
    } catch (error) {
      console.error("Server error", error);
      throw error;
    }
  }
}
