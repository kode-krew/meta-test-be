import { IsEmail, IsNotEmpty } from 'class-validator';
export class EmailVerificationRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
