import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailVerificationRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'e4e74363-c3ed-45fb-ba68-faad0ef45ab3',
    description: 'request id',
  })
  request_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    required: true,
    example: 1234,
    description: 'auth code',
  })
  code: number;
}
