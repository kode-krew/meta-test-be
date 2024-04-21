import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequestBodyBadRequestError {
  @ApiProperty({
    example: ['refresh_token must be a string'],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
