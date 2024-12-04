import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateEmailVerificationRequestDto {
  @IsNotEmpty()
  @IsString()
  request_id: string;

  @IsNotEmpty()
  @IsNumber()
  code: number;
}
