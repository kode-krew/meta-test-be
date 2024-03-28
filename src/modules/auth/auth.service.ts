import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { CreateTokenRequestDto } from './dto/create-token-request.dto';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.authRepository.findOneByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(userInfo: CreateTokenRequestDto): Promise<any> {
    const user = await this.validateUser(userInfo.email, userInfo.password);
    if (!user) {
      throw new UnauthorizedException('User not found or password does not match');
    }

    // JWT 토큰 생성
    const payload = { Id: user.Id, SortKey: user.SortKey };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }), 
    };

    // 여기에 더 많은 비즈니스 로직 구현
  }
}