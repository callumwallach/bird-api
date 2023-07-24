import { Test, TestingModule } from '@nestjs/testing';
import { ResidencyService } from './residency.service';
import { Repository } from 'typeorm';
import { Residency } from './residency.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddResidencyDto } from './dtos/add-residency.dto';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    create: jest.fn((dto) => {
      return { ...dto, id: 1, created_at: new Date() };
    }),
    save: jest.fn((dto) => dto),
    // ...
  }),
);

describe('ResidencyService', () => {
  let service: ResidencyService;
  let repositoryMock: MockType<Repository<Residency>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResidencyService,
        {
          provide: getRepositoryToken(Residency),
          useFactory: repositoryMockFactory,
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
    const now = new Date();
    const house = null;
    const dto: AddResidencyDto = { birds: 2, eggs: 5 };
    const residency = {
      id: 1,
      birds: dto.birds,
      eggs: dto.eggs,
      house: house,
      created_at: now,
    };
    // Now you can control the return value of your mock's methods
    //repositoryMock.findOne.mockReturnValue(residency);
    expect(await service.createResidency(dto, house)).toEqual(residency);
    // And make assertions on how often and with what params your mock's methods are called
    //expect(repositoryMock.findOne).toHaveBeenCalledWith(residency);
  });
});
