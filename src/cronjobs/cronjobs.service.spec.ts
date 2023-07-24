import { Test, TestingModule } from '@nestjs/testing';
import { CronjobsService } from './cronjobs.service';
import { HouseService } from '../house/house.service';

describe('CronjobsService', () => {
  let service: CronjobsService;

  const fakeHouseService = {
    pruneHouses: (date: Date) => Promise.resolve(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CronjobsService,
        { provide: HouseService, useValue: fakeHouseService },
      ],
    }).compile();

    service = module.get<CronjobsService>(CronjobsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
