import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfoRequestDto {
  @IsOptional()
  @IsEmail()
  @ApiProperty({
    required: false,
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;

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
  @ApiProperty({
    required: false,
    example: 'm',
    description: 'The gender of the user',
  })
  gender?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    example: 20,
    description: 'The age of the user',
  })
  age?: number;
}
