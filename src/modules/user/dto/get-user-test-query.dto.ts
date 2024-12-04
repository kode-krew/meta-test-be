import { IsString } from 'class-validator';

export class GetUserTestQueryDto {
  @IsString()
  sort_key: string;
}
