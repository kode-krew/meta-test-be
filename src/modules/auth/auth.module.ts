import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AuthController } from './auth.controller';
import { DynamoDBModule } from '../../database/dynamodb/dynamodb.module';
import { JwtStrategy } from '../../auth/strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { GoogleStrategy } from 'src/auth/strategy/google.strategy';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    DynamoDBModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    UserRepository,
    AuthRepository,
    JwtStrategy,
    KakaoStrategy,
    GoogleStrategy,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
