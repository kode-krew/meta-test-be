import { Module } from '@nestjs/common';
import { HealthCheckController } from './modules/health-check/health-check.controller';
import { DynamoDBModule } from './database/dynamodb/dynamodb.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    DynamoDBModule,
    UserModule],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
