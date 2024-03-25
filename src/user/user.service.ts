import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInfoDto } from './dto/create-user-info.dto';
import { UserInfoResponseDto } from './dto/user-info-response.dto';
import { TreeRepositoryUtils } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    return this.usersRepository.findOneById(id);
  }

  async create(userInfo: CreateUserInfoDto): Promise<any> {
    const user = await this.usersRepository.create(userInfo);
    const { password, SortKey, ...result } = user;
    return result
  }

  // 여기에 더 많은 비즈니스 로직 구현
}