import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateTokenRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;
}
