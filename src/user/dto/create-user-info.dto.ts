import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserInfoDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @MinLength(8)
    password: string;

    nickname?: string;
    gender?: string;
};
