import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { DynamoDBModule } from '../database/dynamodb/dynamodb.module';

@Module({
  imports: [DynamoDBModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository
  ],
})
export class UserModule {}