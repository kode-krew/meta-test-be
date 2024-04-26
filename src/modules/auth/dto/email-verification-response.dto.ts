import { ApiProperty } from '@nestjs/swagger';

export class EmailVerificationResponseDto {
  @ApiProperty({ example: 'e4e74363-c3ed-45fb-ba68-faad0ef45ab3' })
  request_id: string;
}
