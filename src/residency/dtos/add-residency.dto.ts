import { IsNumber, Min } from 'class-validator';

export class AddResidencyDto {
  @IsNumber()
  @Min(0)
  birds: number;

  @IsNumber()
  @Min(0)
  eggs: number;
}
