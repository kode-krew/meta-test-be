import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserInfoRequestDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  password?: string;
}
