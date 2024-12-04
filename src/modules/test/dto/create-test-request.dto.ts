import {
  Min,
  Max,
  IsString,
  IsInt,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TestLevel } from '../test.entity';

export class CreateTestRequestDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @IsIn(Object.values(TestLevel))
  level: TestLevel;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  total_count?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(30)
  expected_count?: number;

  @IsArray()
  @IsString({ each: true })
  total_words: string[];

  @IsArray()
  @IsString({ each: true })
  input_words: string[];
}
