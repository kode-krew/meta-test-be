import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check/health-check.controller';
import { DynamoDBModule } from './database/dynamodb/dynamodb.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DynamoDBModule,
    UserModule],
  controllers: [HealthCheckController],
  providers: [],
})
export class AppModule {}
