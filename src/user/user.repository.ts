import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { User } from './domain/user';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(
    data: Omit<UserEntity, 'id' | 'created_at' | 'updated_at'>): Promise<UserEntity> {
    return await this.userRepository.save(data);
  }
}