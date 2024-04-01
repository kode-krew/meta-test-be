import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true, example: 'john.doe@example.com', description: 'The email of the user' })
  email: string;

  @IsString()
  @ApiProperty({ required: true, example: 'Password@1234', description: 'The password of the user' })
  password: string;
}
