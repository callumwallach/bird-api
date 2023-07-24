import { Injectable, Inject } from '@nestjs/common';
import { HouseService } from '../house/house.service';
import { GetHousesDto } from './dtos/get-houses.dto';
import { GetHouseDto } from './dtos/get-house.dto';

/*
  Provides admin service operations
*/
@Injectable()
export class AdminService {
  constructor(@Inject(HouseService) private houseService: HouseService) {}

  async findHouse(id: string, query: GetHouseDto) {
    return await this.houseService.findHouse(id, query.active);
  }

  async findHouses(query: GetHousesDto) {
    return await this.houseService.findHouses(
      query.limit,
      query.page,
      query.active,
    );
  }

  async updateStatus(id: string, status: boolean) {
    return await this.houseService.updateStatus(id, status);
  }
}
