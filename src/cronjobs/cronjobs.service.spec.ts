import * as dayjs from 'dayjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CronjobsService } from './cronjobs.service';
import { HouseService } from '../house/house.service';
import { House } from 'src/house/house.entity';

describe('CronjobsService', () => {
  let service: CronjobsService;
  let fakeHouseService: Partial<HouseService>;

  beforeEach(async () => {
    const oldDate = dayjs().subtract(13, 'month').toDate();
    // prettier-ignore
    const houses: House[] = [
      { id: '1', ubid: '1', name: 'test house 1', active: true, updated_at: oldDate } as unknown as House,
      { id: '2', ubid: '2', name: 'test house 2', active: true, updated_at: new Date() } as unknown as House,
      { id: '3', ubid: '3', name: 'test house 3', active: true, updated_at: oldDate } as unknown as House,
      { id: '4', ubid: '4', name: 'test house 4', active: true, updated_at: oldDate } as unknown as House,
      { id: '5', ubid: '5', name: 'test house 5', active: true, updated_at: new Date() } as unknown as House,
    ];
    fakeHouseService = {
      pruneHouses: (date: Date) => {
        const affected = houses.filter((house) =>
          dayjs(house.updated_at.getTime()).isBefore(date),
        );
        return Promise.resolve(affected.length);
      },
    };

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

  it('should prune old houses', async () => {
    const affected = await service.pruneInactiveHouses();
    expect(affected).toBe(3);
  });
});
