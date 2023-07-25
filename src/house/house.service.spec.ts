import { Test, TestingModule } from '@nestjs/testing';
import { HouseService } from './house.service';
import { ResidencyService } from '../residency/residency.service';
import { AddResidencyDto } from 'src/residency/dtos/add-residency.dto';
import { House } from './house.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Residency } from 'src/residency/residency.entity';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

// // @ts-ignore
// export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
//   () => ({
//     findOne: jest.fn((entity) => entity),
//     // ...
//   }),
// );

describe('HouseService', () => {
  let service: HouseService;
  //let repositoryMock: MockType<Repository<House>>;
  let fakeResidencyService: Partial<ResidencyService>;
  let houses: House[] = [];
  let residencies: Residency[] = [];

  beforeEach(async () => {
    houses = [];
    residencies = [];

    fakeResidencyService = {
      createResidency: (dto: AddResidencyDto, house: House) => {
        //console.log('create residency:', dto, house);
        const residency = {
          ...dto,
          id: new Date().getTime(),
          house,
          created_at: new Date(),
        } as Residency;
        residencies.push(residency);
        return Promise.resolve(residency);
      },
    };

    const finder = (id: string, active?: boolean) => {
      const found = houses.find((house) => {
        if (house.id === id) {
          if (active !== undefined) {
            return house.active === active;
          }
          return true;
        }
        return false;
      });
      return found;
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HouseService,
        { provide: ResidencyService, useValue: fakeResidencyService },
        {
          provide: getRepositoryToken(House),
          useValue: {
            create: (house: House) => {
              //console.log('create house', house);
              return house;
            },
            findOne: (options: FindOneOptions) => {
              const id = (options.where as { id: string }).id;
              const active = (options.where as { active: boolean }).active;
              return finder(id, active);
            },
            // prettier-ignore
            findOneBy: ({id, active}) => {
              return finder(id, active)
            },
            findAndCount: (options: FindManyOptions) => {
              const take = options.take;
              const skip = options.skip;
              const found = houses.slice(skip, skip + take);
              //console.log(found:", found);
              return Promise.resolve([found, houses.length]);
            },
            save: (house: House) => {
              //console.log('save house', house);
              const index = houses.findIndex((h) => h.id === house.id);
              if (index !== -1) {
                const found = houses[index];
                Object.assign(found, house);
              } else {
                houses.push(house);
              }
              return Promise.resolve(house);
            },
          },
        },
        // {
        //   provide: getRepositoryToken(House),
        //   useFactory: repositoryMockFactory,
        // },
      ],
    }).compile();

    service = module.get<HouseService>(HouseService);
    //repositoryMock = module.get(getRepositoryToken(House));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a house', async () => {
    const house = { lat: 45, lng: 55, name: 'test house' };
    const created = await service.create(house);
    expect(created).toBeDefined();
    expect(created).toEqual(expect.objectContaining({ ...house }));
    expect(created).toEqual(
      expect.objectContaining({
        currentResidency: expect.objectContaining({ birds: 0, eggs: 0 }),
      }),
    );
  });

  it('should update a house info', async () => {
    const house = { lat: 45, lng: 55, name: 'test house' };
    const attrs = { lat: 10, lng: 10, name: 'new name' };
    const created = await service.create(house);
    const updated = await service.updateInfo(created.id, attrs);
    expect(updated).toEqual(expect.objectContaining({ ...attrs }));
  });

  it('should update a house status', async () => {
    const house = { lat: 45, lng: 55, name: 'test house' };
    const created = await service.create(house);
    const updated = await service.updateStatus(created.id, false);
    expect(updated).toEqual(expect.objectContaining({ active: false }));
  });

  it('should add a residency', async () => {
    const house = { lat: 45, lng: 55, name: 'test house' };
    const residency = { birds: 10, eggs: 15 };
    const created = await service.create(house);
    const updated = await service.addResidency(created.id, residency);
    expect(updated).toEqual(expect.objectContaining({ ...house }));
    expect(updated).toEqual(
      expect.objectContaining({
        currentResidency: expect.objectContaining({ birds: 10, eggs: 15 }),
      }),
    );
  });

  it('should find a house', async () => {
    const house = { lat: 45, lng: 55, name: 'test house' };
    const created = await service.create(house);
    const found = await service.findHouse(created.id, true);
    expect(found).toEqual(expect.objectContaining({ ...house }));
  });

  it('should find all houses', async () => {
    const house1 = { lat: 45, lng: 55, name: 'house 1' };
    const house2 = { lat: 55, lng: 65, name: 'house 2' };
    const house3 = { lat: 65, lng: 75, name: 'house 3' };
    const created1 = await service.create(house1);
    const created2 = await service.create(house2);
    const created3 = await service.create(house3);
    const found = await service.findHouses(10, 1);
    expect(found.data.length).toEqual(3);
    expect(found.count).toEqual(3);
    expect(found.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining(house1),
        expect.objectContaining(house2),
        expect.objectContaining(house3),
      ]),
    );
  });

  // Examples

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

  // it('should find one house', async () => {
  //   const house = await controller.findOneHouse('id', {
  //     active: true,
  //   } as GetHouseDto);
  //   expect(house).toEqual({ id: 'id', name: 'test house 1', active: true });
  // });

  // it('should find all active houses', async () => {
  //   //fakeAdminService.find = () => {};
  //   const houses = await controller.findAllHouses({
  //     active: true,
  //   } as GetHousesDto);
  //   expect(houses.data.length).toBe(2);
  //   expect(houses.count).toBe(2);
  // });

  // it('throws an error if user signs up with email that is in use', async () => {
  //   fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
  //   await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  // });

  //  it('throws if signin is called with an unused email', async () => {
  //    await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
  //  });

  // it('throws if an invalid password is provided', async () => {
  //   fakeUsersService.find = () => Promise.resolve([{ email: 'asdf@asdf.com', password: 'laskdjf' } as User]);
  //   await expect(service.signin('laskdjf@alskdfj.com', 'passowrd')).rejects.toThrow(BadRequestException);
  // });
});
