import {
  IsString,
  Length,
  IsLatitude,
  IsLongitude,
  IsOptional,
} from 'class-validator';

export class UpdateHouseInfoDto {
  @IsLatitude()
  @IsOptional()
  lng: number;

  @IsLongitude()
  @IsOptional()
  lat: number;

  @IsString()
  @Length(4, 16)
  @IsOptional()
  name: string;
}
