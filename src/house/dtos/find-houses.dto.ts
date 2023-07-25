import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';
import { HouseDto } from './house-dto';

export class FindHousesDto {
  @IsNumber()
  count: number;

  @IsArray()
  @Type(() => HouseDto)
  data: HouseDto[];
}
