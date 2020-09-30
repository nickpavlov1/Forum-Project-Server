import { IsString, IsNotEmpty, MinDate } from 'class-validator';
import { Transform } from 'class-transformer';
export class SetBanStatusDTO {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @MinDate(new Date())
  @Transform(date => new Date(date))
  expDate: Date;
}
