import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password: string;
}
