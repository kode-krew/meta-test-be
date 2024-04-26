import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/create-user-info-response.dto';
import { UserType } from 'src/types/userType';

@Injectable()
export class UserService {
  constructor(private usersRepository: UserRepository) {}

  async getUserById(id: string): Promise<any> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
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
    userType: UserType,
  ): Promise<CreateUserInfoResponseDto> {
    const user = await this.usersRepository.findOneByEmailAndUserType(
      userInfo.email,
      userType,
    );

    if (user) {
      throw new ConflictException('User exists');
    }

    const item = await this.usersRepository.create({ ...userInfo, userType });

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

  async getUserTestList(id: string, query: any): Promise<any> {
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

    const userTestList = await this.usersRepository.findUserTestList(
      id,
      limit,
      order,
      level,
      startKey,
    );

    return userTestList;
  }

  async getUserTest(id: string, sort_key: string): Promise<any> {
    const userTest = await this.usersRepository.findUserTest(id, sort_key);
    if (!userTest) {
      throw new NotFoundException('User test does not exist');
    }

    const responseItem = {
      id: userTest.PK,
      sort_key: userTest.SK,
      ...userTest,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    return responseItem;
  }
}
