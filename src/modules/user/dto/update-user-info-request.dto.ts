import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfoRequestDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'JohnDoe',
    description: 'The nickname of the user',
  })
  nickname?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'NewPassword@1234', description: 'The new password of the user' })
  password?: string;
}
