import { ApiProperty } from '@nestjs/swagger';

export class GetUserTestListRequestQueryBadRequestError {
  @ApiProperty({
    example: [
      'limit must not be greater than 30',
      'limit must not be less than 1',
      'limit must be an integer number',
      'order must be one of the following values: desc, asc',
      'level must be one of the following values: beginner, intermediate, advanced, all',
    ],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
