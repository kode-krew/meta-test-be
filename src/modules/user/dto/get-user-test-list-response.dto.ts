import { TestLevel } from '../../test/test.entity';

export class Item {
  total_words: string[];

  total_count: number;

  correct_words: string[];

  input_words: string[];

  level: TestLevel;

  expected_count: number;

  category: string;

  score: number;

  createdAt: string;

  id: string;

  sort_key: string;
}

export class GetUserTestListResponseDto {
  items: Item[];

  count: number;

  lastEvaluatedKey?: string;
}
