import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenResponseDto {
  @ApiProperty({ example: "valid.access.token", description: "access token" })
  access_token: string;

  @ApiProperty({ example: "valid.refresh.token", description: "refresh token" })
  refresh_token: string;
}
