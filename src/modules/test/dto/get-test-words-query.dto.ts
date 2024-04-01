import { IsInt, Max, Min, IsString, IsIn } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetTestWordsQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  @ApiProperty({ required: true, example: "10", description: "limit" })
  limit: number;

  @IsString()
  @IsIn(["ko", "en"])
  @ApiProperty({ required: true, example: "ko", description: "language" })
  lang: string;
}
