import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestBodyError {
  @ApiProperty({
    example: ['email should not be empty', 'email must be an email'],
  })
  message: string[];

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
