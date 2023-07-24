import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class GetHousesDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page: number;
}
