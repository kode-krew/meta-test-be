import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailVerificationRequestBodyBadRequestError {
  @ApiProperty({
    example: ['token must be a string', 'token should not be empty'],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
