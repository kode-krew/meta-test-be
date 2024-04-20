import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInfoConflictError {
  @ApiProperty({
    example: 'User exists',
  })
  message: string;

  @ApiProperty({
    example: 'Conflict',
  })
  error: 'Conflict';
}
