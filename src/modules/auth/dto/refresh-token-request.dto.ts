import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

// refresh-token-request.dto.ts
export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: "valid.refresh.token",
    description: "refresh token",
  })
  refresh_token: string;
}
