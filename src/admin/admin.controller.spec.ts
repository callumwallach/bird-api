import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GetHouseDto } from './dtos/get-house.dto';
import { GetHousesDto } from './dtos/get-houses.dto';
import { HouseDto } from 'src/house/dtos/house-dto';
import { FindHousesDto } from 'src/house/dtos/find-houses.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let fakeAdminService: Partial<AdminService>;

  beforeEach(async () => {
    const houses: HouseDto[] = [];
    fakeAdminService = {
      // findHouse: (id: string, query: GetHouseDto) =>
      //   Promise.resolve({ ...house1, id }),
      findHouse: (id: string, query: GetHouseDto) => {
        const filteredHouses = houses.find((house) => house.id === id);
        return Promise.resolve(filteredHouses);
      },
      findHouses: (query: GetHousesDto) => {
        let filteredHouses = houses;
        if (query.active) {
          filteredHouses = filteredHouses.filter((house) => house.active);
        }
        const page = query.page || 1;
        const limit = query.limit || filteredHouses.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        filteredHouses = filteredHouses.slice(start, end);
        return Promise.resolve({
          data: filteredHouses,
          count: houses.length,
        } as FindHousesDto);
      },
      updateStatus: (id: string, status: boolean) =>
        Promise.resolve({} as HouseDto),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [{ provide: AdminService, useValue: fakeAdminService }],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
