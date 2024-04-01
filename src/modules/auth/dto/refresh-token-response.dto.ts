import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenResponseDto {
  @ApiProperty({ example: "valid.access.token", description: "access token" })
  access_token: string;

  @ApiProperty({ example: "valid.refresh.token", description: "refresh token" })
  refresh_token: string;
}
