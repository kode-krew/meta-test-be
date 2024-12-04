import { IsInt, Max, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { TestLevel, Order } from '../../test/test.entity';

export class GetUserTestListQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  limit: number;

  @IsOptional()
  @IsIn(Object.values(Order))
  order?: Order;

  @IsOptional()
  @IsIn(Object.values(TestLevel))
  level?: TestLevel;

  @IsOptional()
  startKey?: string;
}
