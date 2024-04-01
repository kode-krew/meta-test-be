import { ApiProperty } from "@nestjs/swagger";

export class GetTestWordsResponseDto {
  @ApiProperty({
    example: ["word1", "word2", "word3", "word4", "word5"],
    description: "test words",
  })
  words: string[];
}
