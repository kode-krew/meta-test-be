import { Module } from '@nestjs/common';
import { HealthCheckController } from './modules/health-check/health-check.controller';
import { DynamoDBModule } from './database/dynamodb/dynamodb.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [DynamoDBModule, UserModule, AuthModule, TestModule],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
