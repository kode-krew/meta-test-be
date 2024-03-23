import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInfoDto } from './dto/create-user-info.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    return this.usersRepository.findOneById(id);
  }

  async create(userInfo: CreateUserInfoDto): Promise<any> {
    console.log('userInfo:', userInfo)
    return this.usersRepository.create(userInfo);
  }


  // 여기에 더 많은 비즈니스 로직 구현
}