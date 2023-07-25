import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Residency } from '../../residency/residency.entity';

export class HouseDto {
  @IsString()
  id: string;

  @IsString()
  ubid: string;

  @IsString()
  name: string;

  @IsNumber()
  lng: number;

  @IsNumber()
  lat: number;

  @IsObject()
  @Type(() => Residency)
  currentResidency: Residency;

  @IsArray()
  @Type(() => Residency)
  residencyHistory: Residency[];

  @IsBoolean()
  active: boolean;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;
}
