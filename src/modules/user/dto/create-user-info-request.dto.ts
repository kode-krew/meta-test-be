import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInfoDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({required: true, example: 'john.doe@example.com', description: 'The email of the user'})
    email: string;

    @MinLength(8)
    @ApiProperty({required: true, example: 'Password@1234', description: 'The password of the user' })
    password: string;

    @ApiProperty({required: false, example: 'JohnDoe', description: 'The nickname of the user'})
    nickname?: string;
    
    @ApiProperty({required: false, example: 'm', description: 'The gender of the user'})
    gender?: string;
};
