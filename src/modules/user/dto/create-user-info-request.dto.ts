import { IsEmail, IsNotEmpty, MinLength, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInfoRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({required: true, example: 'john.doe@example.com', description: 'The email of the user'})
    email: string;

    @MinLength(8)
    @IsString()
    @ApiProperty({required: true, example: 'Password@1234', description: 'The password of the user' })
    password: string;

    @IsOptional()
    @IsString()
    @ApiProperty({required: false, example: 'JohnDoe', description: 'The nickname of the user'})
    nickname?: string;
    
    @IsOptional()
    @IsString()
    @ApiProperty({required: false, example: 'm', description: 'The gender of the user'})
    gender?: string;

    @IsOptional()
    @IsNumber()
    @ApiProperty({required: false, example: 20, description: 'The age of the user'})
    age?: number;
};
