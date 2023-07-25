import { Test, TestingModule } from '@nestjs/testing';
import { ResidencyService } from './residency.service';
import { Repository } from 'typeorm';
import { Residency } from './residency.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddResidencyDto } from './dtos/add-residency.dto';
import { House } from 'src/house/house.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('ResidencyService', () => {
  let service: ResidencyService;
  let repositoryMock: MockType<Repository<Residency>>;
  //  let repositoryMockFactory: () => MockType<Repository<any>>;

  beforeEach(async () => {
    // // @ts-ignore
    // repositoryMockFactory = jest.fn(() => ({
    //   findOne: jest.fn((entity) => entity),
    //   create: jest.fn((dto) => {
    //     return { ...dto, id: 1, created_at: new Date() };
    //   }),
    //   save: jest.fn((dto) => dto),
    // }));

    // const module: TestingModule = await Test.createTestingModule({
    //   providers: [
    //     ResidencyService,
    //     {
    //       provide: getRepositoryToken(Residency),
    //       useFactory: repositoryMockFactory,
    //     },
    //   ],
    // }).compile();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidencyService,
        {
          provide: getRepositoryToken(Residency),
          useValue: {
            create: ({ birds, eggs }) => {
              const residency = {
                id: Math.floor(Math.random() * 9999),
                birds,
                eggs,
                created_at: new Date(),
              } as Residency;
              return residency;
            },
            findOne: (residency: Residency) => residency,
            save: (residency: Residency) => {
              return Promise.resolve(residency);
            },
          },
        },
      ],
    }).compile();

    service = module.get<ResidencyService>(ResidencyService);
    repositoryMock = module.get(getRepositoryToken(Residency));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a residency', async () => {
    const house = { id: '1' } as House;
    const dto: AddResidencyDto = { birds: 2, eggs: 5 };
    const created = await service.createResidency(dto, house);
    expect(created.birds).toEqual(dto.birds);
    expect(created.eggs).toEqual(dto.eggs);
    expect(created.house.id === '1').toEqual(house.id === '1');
  });
});
