import { IsInt, Max, Min, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetUserTestQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  @ApiProperty({ required: true, example: "10", description: "limit" })
  limit: number;

  @IsOptional()
  @ApiProperty({
    required: false,
    example:
      "eyJJZCI6IjIwNDA3YTRjLTJkNzktNGRkOC1iZDE3LTkyNzFhMzY3ZTk2YyIsIlNvcnRLZXkiOiJUZXN0IzIwMjQtMDMtMzBUMDE6NDQ6MTYuMDQ3WiJ9",
    description: "Base64 encoded startKey",
  })
  startkey?: string;
}
