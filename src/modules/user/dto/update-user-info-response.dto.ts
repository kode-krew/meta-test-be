import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserType } from 'src/types/userType';

export class UpdateUserInfoResponseDto {
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
