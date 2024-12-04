import { TestLevel } from '../../test/test.entity';

export class GetUserTestResponseDto {
  id: string;

  sort_key: string;

  level: TestLevel;

  score: number;

  total_count?: number;

  expected_count?: number;

  correct_count?: number;

  total_words: string[];

  input_words: string[];

  correct_words: string[];
}
