import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./auth.repository";
import { AuthController } from "./auth.controller";
import { DynamoDBModule } from "../../database/dynamodb/dynamodb.module";
import { JwtStrategy } from "../../auth/jwt/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { KakaoStrategy } from "src/auth/strategy/kakao.strategy";

@Module({
  imports: [
    DynamoDBModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1h" },
    }),
    UserModule,
  ],

  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, KakaoStrategy],
})
export class AuthModule {}


