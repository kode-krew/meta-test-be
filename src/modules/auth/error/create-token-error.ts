import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenRequestBodyError {
  @ApiProperty({
    example: [
      'email should not be empty',
      'email must be an email',
      'password must be a string',
      'password must be longer than or equal to 8 characters',
    ],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
