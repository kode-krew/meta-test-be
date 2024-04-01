import { Module, Global } from "@nestjs/common";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

@Global()
@Module({
  providers: [
    {
      provide: "DYNAMODB",
      useFactory: () => {
        const client = new DynamoDB({
          credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
          },
          region: process.env.REGION,
        });
        return DynamoDBDocument.from(client);
      },
    },
  ],
  exports: ["DYNAMODB"],
})
export class DynamoDBModule {}
