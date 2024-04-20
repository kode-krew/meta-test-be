import { ApiProperty } from '@nestjs/swagger';

export class CreateTestRequestBodyBadRequestError {
  @ApiProperty({
    example: [
      'level must be one of the following values: beginner, intermediate, advanced, all',
      'level must be a string',
      'total_count must not be greater than 30',
      'total_count must not be less than 1',
      'total_count must be an integer number',
      'expected_count must not be greater than 30',
      'expected_count must not be less than 0',
      'expected_count must be an integer number',
      'each value in total_words must be a string',
      'total_words must be an array',
      'each value in input_words must be a string',
      'input_words must be an array',
    ],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
