import { ApiProperty } from '@nestjs/swagger';

export class GetUserInfoNotFoundErrorDto {
  @ApiProperty({
    example: ['User does not exists'],
  })
  message: string[];

  @ApiProperty({
    example: 'Not Found',
  })
  error: 'Not Found';
}
