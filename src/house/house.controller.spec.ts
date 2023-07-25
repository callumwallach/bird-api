import { Test, TestingModule } from '@nestjs/testing';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseInfoDto } from './dtos/update-house-info.dto';
import { AddResidencyDto } from 'src/residency/dtos/add-residency.dto';
import { HouseDto } from './dtos/house-dto';
import { FindHousesDto } from './dtos/find-houses.dto';

describe('HouseController', () => {
  let controller: HouseController;
  let fakeHouseService: Partial<HouseService>;

  beforeEach(async () => {
    // create a fake copy of the service
    fakeHouseService = {
      create: (dto: CreateHouseDto) => Promise.resolve({} as HouseDto),
      updateInfo: (id: string, dto: UpdateHouseInfoDto) =>
        Promise.resolve({} as HouseDto),
      updateStatus: (id: string, status: boolean) =>
        Promise.resolve({} as HouseDto),
      addResidency: (id: string, dto: AddResidencyDto) =>
        Promise.resolve({} as HouseDto),
      findHouse: (id: string, active?: boolean) =>
        Promise.resolve({} as HouseDto),
      findHouses: (limit: number, page: number, activeOnly?: boolean) =>
        Promise.resolve({} as FindHousesDto),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HouseController],
      providers: [{ provide: HouseService, useValue: fakeHouseService }],
    }).compile();

    controller = module.get<HouseController>(HouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
