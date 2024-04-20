import { IsInt, Max, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TestLevel, Order } from '../../../test/test.entity';

export class GetUserTestQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  @ApiProperty({
    required: true,
    example: '10',
    description: 'limit, minimum: 1',
  })
  limit: number;

  @IsOptional()
  @IsIn(Object.values(Order))
  @ApiProperty({
    required: false,
    enum: Order,
    default: 'desc',
    description: 'order by created_at',
  })
  order?: Order;

  @IsOptional()
  @IsIn(Object.values(TestLevel))
  @ApiProperty({
    required: false,
    enum: TestLevel,
    default: 'all',
    description: 'filter by level',
  })
  level?: TestLevel;

  @IsOptional()
  @ApiProperty({
    required: false,
    example:
      'eyJJZCI6IjIwNDA3YTRjLTJkNzktNGRkOC1iZDE3LTkyNzFhMzY3ZTk2YyIsIlNvcnRLZXkiOiJUZXN0IzIwMjQtMDMtMzBUMDE6NDQ6MTYuMDQ3WiJ9',
    description: 'Base64 encoded startKey',
  })
  startkey?: string;
}
