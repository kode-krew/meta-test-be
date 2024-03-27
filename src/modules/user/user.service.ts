import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('user does not exists')
    }
    const { password, SortKey, ...result } = user;
    return result
  }

  async create(userInfo: CreateUserInfoRequestDto): Promise<any> {
    const user = await this.usersRepository.create(userInfo);
    const { password, SortKey, ...result } = user;
    return result
  }

  async update(id: string, userInfo: UpdateUserInfoRequestDto): Promise<any> {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      throw new BadRequestException('At least one of nickname, gender, age is required.');
    }

    const user = await this.usersRepository.update(id, userInfo);
    const { password, SortKey, ...result } = user;
    return result
  }
  // 여기에 더 많은 비즈니스 로직 구현
}