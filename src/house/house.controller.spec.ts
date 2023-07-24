import { Test, TestingModule } from '@nestjs/testing';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseInfoDto } from './dtos/update-house-info.dto';
import { AddResidencyDto } from 'src/residency/dtos/add-residency.dto';

describe('HouseController', () => {
  let controller: HouseController;

  const fakeHouseService = {
    create: (dto: CreateHouseDto) => Promise.resolve({}),
    updateInfo: (id: string, dto: UpdateHouseInfoDto) => Promise.resolve({}),
    updateStatus: (id: string, status: boolean) => Promise.resolve({}),
    addResidency: (id: string, dto: AddResidencyDto) => Promise.resolve({}),
    findHouse: (id: string, active?: boolean) => Promise.resolve({}),
    findHouses: (limit: number, page: number, activeOnly?: boolean) =>
      Promise.resolve([]),
  };

  beforeEach(async () => {
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
