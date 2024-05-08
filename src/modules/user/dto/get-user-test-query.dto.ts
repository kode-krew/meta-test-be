import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserTestQueryDto {
  @IsString()
  @ApiProperty({
    example: 'Test_advanced_2024-04-20T01:19:42.998Z',
    description: 'The sort key of the test',
  })
  sort_key: string;
}
