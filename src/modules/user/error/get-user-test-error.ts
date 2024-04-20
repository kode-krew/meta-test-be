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

export class GetUserTestRequestQueryBadRequestError {
  @ApiProperty({
    example: ['sort_key must be a string'],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
