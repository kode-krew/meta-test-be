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
import { ApiProperty } from '@nestjs/swagger';
import { TestLevel } from '../test.entity';

export class CreateTestRequestDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '422838ab-3a92-4e5f-914c-5eae24249a92',
    description: 'id',
  })
  id?: string;

  @IsString()
  @IsIn(Object.values(TestLevel))
  @ApiProperty({
    enum: TestLevel,
    description: 'level',
  })
  level: TestLevel;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  @ApiProperty({ example: 10, description: 'total_count' })
  total_count?: number;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  @Max(30)
  @ApiProperty({ example: 5, description: 'expected_count' })
  expected_count?: number;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['word1', 'word2', 'word3', 'word4', 'word5'],
    description: 'An array of total words for the test.',
  })
  total_words: string[];

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    example: ['word1', 'word2'],
    description: 'An array of input words for the test.',
  })
  input_words: string[];
}
