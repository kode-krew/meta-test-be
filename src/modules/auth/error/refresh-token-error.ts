import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestBodyError {
  @ApiProperty({
    example: [
      'refresh_token must be a string',
      'refresh_token should not be empty',
    ],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
