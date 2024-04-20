import { Injectable } from '@nestjs/common';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInfoRequestDto } from './dto/http/create-user-info-request.dto';
import { UpdateUserInfoRequestDto } from './dto/http/update-user-info-request.dto';
import { GetUserTestQueryDto } from './dto/http/get-user-test-query.dto';
import { CreateUserInfoResponseDto } from './dto/http/create-user-info-response.dto';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User does not exists');
    }

    const responseItem = {
      id: user.PK,
      ...user,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    delete responseItem.password;
    return responseItem;
  }

  async create(
    userInfo: CreateUserInfoRequestDto,
  ): Promise<CreateUserInfoResponseDto> {
    const user = await this.usersRepository.findOneByEmail(userInfo.email);

    if (user) {
      throw new BadRequestException('User exist');
    }

    const item = await this.usersRepository.create(userInfo);

    const responseItem = {
      id: item.PK,
      ...item,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    delete responseItem.password;
    return responseItem;
  }

  async update(id: string, userInfo: UpdateUserInfoRequestDto): Promise<any> {
    if (!userInfo || Object.keys(userInfo).length === 0) {
      throw new BadRequestException(
        'At least one of nickname, gender, age is required.',
      );
    }

    const user = await this.usersRepository.update(id, userInfo);

    const responseItem = {
      id: user.PK,
      ...user,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    delete responseItem.password;
    return responseItem;
  }

  async getUserTest(id: string, query: GetUserTestQueryDto): Promise<any> {
    const limit = query.limit;
    const order = query.order;
    const level = query.level;
    const encodedStartKey = query.startkey;
    let startKey: any;
    if (encodedStartKey) {
      const decodedString = Buffer.from(encodedStartKey, 'base64').toString(
        'utf-8',
      );
      startKey = JSON.parse(decodedString);
    }

    const userTest = await this.usersRepository.findUserTest(
      id,
      limit,
      order,
      level,
      startKey,
    );
    return userTest;
  }
}
