import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateUserInfoRequestDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;
}
