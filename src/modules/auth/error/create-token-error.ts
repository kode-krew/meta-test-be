import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenBadRequestError {
  @ApiProperty({
    example: 'User not found or password does not match',
  })
  message: string;

  @ApiProperty({
    example: 'Bad Request',
  })
  error: 'Bad Request';
}
