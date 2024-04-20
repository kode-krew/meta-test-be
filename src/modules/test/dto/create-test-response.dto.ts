import { ApiProperty } from '@nestjs/swagger';
import { TestLevel } from '../test.entity';

export class CreateTestResponseDto {
  @ApiProperty({
    example: '422838ab-3a92-4e5f-914c-5eae24249a92',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    example: 'Test#advanced#2024-04-20T01:19:42.998Z',
    description: 'The sort key of the test',
  })
  sort_key: string;
}
