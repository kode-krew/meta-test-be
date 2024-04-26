import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailVerificationRequestBodyError {
  @ApiProperty({
    example: [
      'request_id must be a string',
      'request_id should not be empty',
      'code must be a number conforming to the specified constraints',
      'code should not be empty',
    ],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
