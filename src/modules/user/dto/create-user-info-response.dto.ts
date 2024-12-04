import { IsEnum } from 'class-validator';
import { UserType } from 'src/types/userType';

// password 필드는 포함하지 않습니다.
export class CreateUserInfoResponseDto {
  id: string;

  email: string;

  nickname?: string;

  gender?: string;

  age?: number;

  @IsEnum(UserType)
  userType: UserType;
}
