import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserInfoRequestDto {
  @ApiProperty({
    required: false,
    example: "JohnDoe",
    description: "The nickname of the user",
  })
  nickname?: string;

  @ApiProperty({
    required: false,
    example: "m",
    description: "The gender of the user",
  })
  gender?: string;

  @ApiProperty({
    required: false,
    example: 20,
    description: "The age of the user",
  })
  age?: number;
}
