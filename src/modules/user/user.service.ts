import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { generateRandomNickName } from 'src/core/utils/generate-random-nickname.util';
import { UserType } from 'src/types/userType';
import { AuthRepository } from '../auth/auth.repository';
import { CreateUserInfoRequestDto } from './dto/create-user-info-request.dto';
import { CreateUserInfoResponseDto } from './dto/create-user-info-response.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-info-request.dto';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private usersRepository: UserRepository,
    private authRepository: AuthRepository,
  ) {}

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
    console.log(userInfo, userType, 'userInfo, userType');
    if (userType === UserType.NORMAL) {
      const emailVerification =
        await this.authRepository.findEmailVerificationByEmail(userInfo.email);
      if (!emailVerification || !emailVerification.is_verified) {
        throw new BadRequestException('Invalid email verification');
      }
    }

    const user = await this.usersRepository.findOneByEmailAndUserType(
      userInfo.email,
      userType,
    );

    if (user) {
      throw new ConflictException('User exists');
    }

    if (!userInfo.nickname) {
      const nickName = generateRandomNickName();
      userInfo['nickname'] = nickName;
    }

    const item = await this.usersRepository.create(userInfo, userType);

    const responseItem = {
      id: item.PK,
      userType,
      ...item,
    };
    delete responseItem.PK;
    delete responseItem.SK;
    delete responseItem.password;
    return responseItem;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async getAllUsers() {
    return await this.usersRepository.findAllUsers();
  }

  async update(
    id: string,
    userInfo: UpdateUserInfoRequestDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password, nickname } = userInfo;

    if (!email && !password && !nickname) {
      throw new BadRequestException(
        'At least one of email, password, or nickname is required.',
      );
    }

    const updateData: Partial<User> = {};

    if (email) {
      updateData.email = email;
    }

    if (password) {
      const hashedPassword = await this.hashPassword(password);
      updateData.password = hashedPassword;
    }

    if (nickname) {
      updateData.nickname = nickname;
    }

    const user = await this.usersRepository.update(id, updateData);
    const responseItem: Omit<User, 'password'> = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      // 다른 필드들...
    };

    return responseItem;
  }

  async getUserTestList(id: string, query: any): Promise<any> {
    const limit = query.limit;
    const order = query.order;
    const level = query.level;
    const encodedStartKey = query.startKey;
    let startKey: string;
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
