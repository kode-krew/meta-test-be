import { ApiProperty } from '@nestjs/swagger';
import { TestLevel } from '../../test.entity';

export class CreateTestResponseDto {
  @ApiProperty({
    example: '422838ab-3a92-4e5f-914c-5eae24249a92',
    description: 'The id of the user',
  })
  id: string;

  @ApiProperty({
    enum: TestLevel,
    description: 'level',
  })
  level: TestLevel;

  @ApiProperty({ example: 0.5, description: 'score' })
  score: number;

  @ApiProperty({ example: 10, description: 'total_count' })
  total_count?: number;

  @ApiProperty({ example: 5, description: 'expected_count' })
  expected_count?: number;

  @ApiProperty({ example: 5, description: 'expected_count' })
  correct_count?: number;

  @ApiProperty({
    example: ['word1', 'word2', 'word3', 'word4', 'word5'],
    description: 'An array of total words for the test.',
  })
  total_words: string[];

  @ApiProperty({
    example: ['word1', 'word2'],
    description: 'An array of input words for the test.',
  })
  input_words: string[];

  @ApiProperty({
    example: ['word1'],
    description: 'An array of correct words for the test.',
  })
  correct_words: string[];
}
