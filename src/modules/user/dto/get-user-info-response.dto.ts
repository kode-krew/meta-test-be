import { ApiProperty } from '@nestjs/swagger';

// password 필드는 포함하지 않습니다.
export class GetUserInfoResponseDto {
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
}
