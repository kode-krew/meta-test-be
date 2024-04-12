import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailVerificationRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'valid.temp.token',
    description: 'temp token',
  })
  token: string;
}
