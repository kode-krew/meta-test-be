import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenRequestDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({required: true, example: 'john.doe@example.com', description: 'The email of the user'})
    email: string;

    @MinLength(8)
    @IsString()
    @ApiProperty({required: true, example: 'Password@1234', description: 'The password of the user' })
    password: string;
};
