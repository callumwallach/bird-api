import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { HouseService } from '../house/house.service';
import { HouseDto } from 'src/house/dtos/house-dto';
import { FindHousesDto } from 'src/house/dtos/find-houses.dto';
import { NotFoundException } from '@nestjs/common';
import { GetHousesDto } from './dtos/get-houses.dto';
import { GetHouseDto } from './dtos/get-house.dto';

describe('AdminService', () => {
  let service: AdminService;
  let fakeHouseService: Partial<HouseService>;

  beforeEach(async () => {
    const houses: HouseDto[] = [
      { id: '1', ubid: '1', name: 'test house 1', active: true } as HouseDto,
      { id: '2', ubid: '2', name: 'test house 2', active: false } as HouseDto,
      { id: '3', ubid: '3', name: 'test house 3', active: true } as HouseDto,
      { id: '4', ubid: '4', name: 'test house 4', active: true } as HouseDto,
      { id: '5', ubid: '5', name: 'test house 5', active: false } as HouseDto,
    ];
    fakeHouseService = {
      findHouse: (id: string, activeOnly?: boolean) => {
        const house = houses.find((house) => {
          if (house.id === id) {
            if (activeOnly !== undefined) {
              return house.active === activeOnly;
            }
            return true;
          }
          return false;
        });
        return Promise.resolve(house);
      },
      findHouses: (l: number, p: number, active: boolean) => {
        let filteredHouses = houses;
        if (active !== undefined) {
          filteredHouses = filteredHouses.filter((house) => house.active);
        }
        const page = p || 1;
        const limit = l || filteredHouses.length;
        const start = (page - 1) * limit;
        const end = start + limit;
        filteredHouses = filteredHouses.slice(start, end);
        return Promise.resolve({
          data: filteredHouses,
          count: houses.length,
        } as FindHousesDto);
      },
      updateStatus: (id: string, status: boolean) => {
        const house = houses.find((house) => house.id === id);
        if (!house) {
          throw new NotFoundException('house not found');
        }
        house.active = status;
        return Promise.resolve(house);
      },
    };

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

  it('should find one active house', async () => {
    const house = await service.findHouse('1', { active: true });
    expect(house.id).toEqual('1');
  });

  it('should find one inactive house', async () => {
    const house = await service.findHouse('2', {} as GetHouseDto);
    expect(house.id).toEqual('2');
  });

  it('should find all active houses', async () => {
    const house = await service.findHouses({ active: true } as GetHousesDto);
    expect(house.data.length).toEqual(3);
    expect(house.count).toEqual(5);
  });

  it('should find all active and inactive houses', async () => {
    const house = await service.findHouses({} as GetHousesDto);
    expect(house.data.length).toEqual(5);
    expect(house.count).toEqual(5);
  });

  it('should find first page of houses', async () => {
    const house = await service.findHouses({
      limit: 3,
      page: 1,
    } as GetHousesDto);
    expect(house.data.length).toEqual(3);
    expect(house.count).toEqual(5);
  });

  it('should find second page of houses', async () => {
    const house = await service.findHouses({
      limit: 3,
      page: 2,
    } as GetHousesDto);
    expect(house.data.length).toEqual(2);
    expect(house.count).toEqual(5);
  });
});
