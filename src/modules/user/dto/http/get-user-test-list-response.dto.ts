import { ApiProperty } from '@nestjs/swagger';
import { TestLevel } from '../../../test/test.entity';

export class Item {
  @ApiProperty({
    example: ['애플', '메타', '테슬라'],
    description: 'The total words',
  })
  total_words: string[];

  @ApiProperty({ example: 3, description: 'The total count' })
  total_count: number;

  @ApiProperty({
    example: ['애플', '메타', '테슬라'],
    description: 'The correct words',
  })
  correct_words: string[];

  @ApiProperty({
    example: ['애플', '메타', '테슬라'],
    description: 'The input words',
  })
  input_words: string[];

  @ApiProperty({ enum: TestLevel, description: 'The level' })
  level: TestLevel;

  @ApiProperty({ example: 1, description: 'The expected count' })
  expected_count: number;

  @ApiProperty({ example: 'test', description: 'The category' })
  category: string;

  @ApiProperty({ example: 0, description: 'The score' })
  score: number;

  @ApiProperty({
    example: '2024-03-30T01:44:00.232Z',
    description: 'The creation date',
  })
  createdAt: string;

  @ApiProperty({
    example: '20407a4c-2d79-4dd8-bd17-9271a367e96c',
    description: 'The ID',
  })
  id: string;

  @ApiProperty({
    example: 'Test#2024-03-30T01:44:00.232Z',
    description: 'The SortKey',
  })
  SortKey: string;
}

export class GetUserTestListResponseDto {
  @ApiProperty({ type: [Item], description: 'The list of items' })
  items: Item[];

  @ApiProperty({ example: 1, description: 'The count of items' })
  count: number;

  @ApiProperty({
    example:
      'eyJJZCI6IjIwNDA3YTRjLTJkNzktNGRkOC1iZDE3LTkyNzFhMzY3ZTk2YyIsIlNvcnRLZXkiOiJUZXN0IzIwMjQtMDMtMzBUMDE6NDQ6MDAuMjMyWiJ9',
    description: 'The last evaluated key for pagination',
    required: false,
  })
  lastEvaluatedKey?: string;
}
