import { Injectable, Inject } from "@nestjs/common";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class AuthRepository {
  private tableName: string;
  constructor(@Inject("DYNAMODB") private dynamoDb: DynamoDBDocument) {
    const env = process.env.NODE_ENV;
    this.tableName = (env === "dev" ? "Dev_" : "") + "UserInfoTest";
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
}
