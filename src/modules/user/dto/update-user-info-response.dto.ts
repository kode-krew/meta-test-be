import { IsEnum } from 'class-validator';
import { UserType } from 'src/types/userType';

export class UpdateUserInfoResponseDto {
  nickname?: string;

  gender?: string;

  age?: number;

  userType: UserType;
}
