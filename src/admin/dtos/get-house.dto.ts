import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class GetHouseDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  active: boolean;
}
