import { Test, TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { ResidencyService } from '../residency/residency.service';
import { AddResidencyDto } from 'src/residency/dtos/add-residency.dto';
import { House } from './house.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHouseDto } from './dtos/create-house.dto';
import { Residency } from 'src/residency/residency.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    // ...
  }),
);

describe('HouseService', () => {
  let service: HouseService;
  let repositoryMock: MockType<Repository<House>>;

  const fakeResidencyService = {
    //find: () => Promise.resolve([]),
    createResidency: (dto: AddResidencyDto, house: House) =>
      Promise.resolve({
        id: 1,
        birds: dto.birds,
        eggs: dto.eggs,
        house,
        created_at: new Date(),
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HouseService,
        { provide: ResidencyService, useValue: fakeResidencyService },
        {
          provide: getRepositoryToken(House),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<HouseService>(HouseService);
    repositoryMock = module.get(getRepositoryToken(House));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should find a user', async () => {
  //   const dto: CreateHouseDto = { name: 'jim', lat: 41.34566, lng: 13.32456 };
  //   const residency:Residency = {}
  //   const house: House = { id: 1, ubid: 1, name: 'jim', lat: 41.34566, lng: 13.32456, currentResidency:  };
  //   // Now you can control the return value of your mock's methods
  //   repositoryMock.findOne.mockReturnValue(user);
  //   expect(service.create(dto)).toEqual(user);
  //   // And make assertions on how often and with what params your mock's methods are called
  //   expect(repositoryMock.findOne).toHaveBeenCalledWith(user.id);
  // });
});
