import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedErrorDto {
  @ApiProperty({
    example: ['No token', 'Invalid token', 'Token expired'],
  })
  message: string[];

  @ApiProperty({
    example: 'Unauthorized',
  })
  error: 'Unauthorized';
}
