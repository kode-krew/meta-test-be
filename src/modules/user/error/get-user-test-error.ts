import { ApiProperty } from '@nestjs/swagger';

export class GetUserTestNotFoundError {
  @ApiProperty({
    example: 'User test does not exist',
  })
  message: string;

  @ApiProperty({
    example: 'Not Found',
  })
  error: 'Not Found';
}
