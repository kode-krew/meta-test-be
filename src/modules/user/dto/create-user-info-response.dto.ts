import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserType } from 'src/types/userType';

// password 필드는 포함하지 않습니다.
export class CreateUserInfoResponseDto {
  @ApiProperty({
    example: '422838ab-3a92-4e5f-914c-5eae24249a92',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({
    required: false,
    example: 'JohnDoe',
    description: 'The nickname of the user',
  })
  nickname?: string;

  @ApiProperty({
    required: false,
    example: 'm',
    description: 'The gender of the user',
  })
  gender?: string;

  @ApiProperty({
    required: false,
    example: 20,
    description: 'The age of the user',
  })
  age?: number;

  @IsEnum(UserType)
  @ApiProperty({
    required: true,
    example: UserType.NORMAL,
    description: '유저 가입 유형(타입)',
  })
  userType: UserType;
}
