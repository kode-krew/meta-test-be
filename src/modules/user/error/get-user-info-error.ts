import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoNotFoundError {
  @ApiProperty({
    example: 'User does not exist',
  })
  message: string;

  @ApiProperty({
    example: 'Not Found',
  })
  error: 'Not Found';
}
