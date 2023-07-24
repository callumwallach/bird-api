import { IsString, Length, IsLatitude, IsLongitude } from 'class-validator';

export class CreateHouseDto {
  @IsLatitude()
  lng: number;

  @IsLongitude()
  lat: number;

  @IsString()
  @Length(4, 16)
  name: string;
}
