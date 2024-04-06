import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  email: string;
}
