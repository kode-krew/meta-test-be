import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { DynamoDBModule } from '../../database/dynamodb/dynamodb.module';

@Module({
  imports: [
    DynamoDBModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '1h' }, 
      }),
    ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository
  ],
})
export class AuthModule {}