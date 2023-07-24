import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { GetHouseDto } from './dtos/get-house.dto';
import { GetHousesDto } from './dtos/get-houses.dto';

describe('AdminController', () => {
  let controller: AdminController;

  const fakeAdminService = {
    findHouse: (id: number, query: GetHouseDto) => Promise.resolve({}),
    findHouses: (query: GetHousesDto) => Promise.resolve([]),
    updateStatus: (id: number, status: boolean) => Promise.resolve({}),
  };

  beforeEach(async () => {
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
