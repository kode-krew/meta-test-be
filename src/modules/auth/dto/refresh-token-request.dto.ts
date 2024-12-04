import { IsNotEmpty, IsString } from 'class-validator';

// refresh-token-request.dto.ts
export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
