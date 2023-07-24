import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { HouseService } from '../house/house.service';

describe('AdminService', () => {
  let service: AdminService;

  const fakeHouseService = {
    findHouse: (id: number, status: boolean) => Promise.resolve({}),
    findHouses: (limit: number, page: number, active: boolean) =>
      Promise.resolve([]),
    updateStatus: (id: number, status: boolean) => Promise.resolve({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: HouseService, useValue: fakeHouseService },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
