import { CreateHouseDto } from '../dtos/create-house.dto';
import { HouseDto } from '../dtos/house-dto';
import { UpdateHouseInfoDto } from '../dtos/update-house-info.dto';
import { House } from '../house.entity';

export const transformFromDto = (
  dto: CreateHouseDto | UpdateHouseInfoDto,
): Partial<House> => {
  return {
    ...dto,
    lat: dto.lat.toString(),
    lng: dto.lng.toString(),
  };
};

export const transformToDto = (house: House): HouseDto => {
  return {
    ...house,
    lat: parseFloat(house.lat),
    lng: parseFloat(house.lng),
  };
};
