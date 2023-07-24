import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  LessThan,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { House } from './house.entity';
import { AddResidencyDto } from '../residency/dtos/add-residency.dto';
import { ResidencyService } from '../residency/residency.service';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseInfoDto } from './dtos/update-house-info.dto';

/*
  Provides house entity operations
*/
@Injectable()
export class HouseService {
  private readonly logger = new Logger(HouseService.name);

  constructor(
    @Inject(ResidencyService) private residencyService: ResidencyService,
    @InjectRepository(House) private repo: Repository<House>,
  ) {}

  async create(houseDto: CreateHouseDto) {
    const uuid = uuidv4();
    this.logger.log(
      `House id:${uuid} created with ${JSON.stringify(houseDto)}`,
    );

    const house = this.repo.create({
      id: uuid,
      ubid: uuid,
      active: true,
      ...this.transformFromDto(houseDto),
    });
    await this.repo.save(house);

    return await this.addResidency(house.id, { birds: 0, eggs: 0 });
  }

  async updateInfo(id: string, attrs: UpdateHouseInfoDto) {
    this.logger.log(
      `House id:${id} info updated with ${JSON.stringify(attrs)}`,
    );

    const house = await this.repo.findOneBy({ id, active: true });
    if (!house) {
      throw new NotFoundException('house not found');
    }

    Object.assign(house, this.transformFromDto(attrs));
    return await this.repo.save(house);
  }

  async updateStatus(id: string, status: boolean) {
    this.logger.log(
      `House id:${id} status updated to ${status ? 'active' : 'inactive'}`,
    );

    const house = await this.repo.findOneBy({ id });
    if (!house) {
      throw new NotFoundException('house not found');
    }
    house.active = status;
    return await this.repo.save(house);
  }

  async addResidency(id: string, residencyDto: AddResidencyDto) {
    this.logger.log(
      `House id:${id} residency updated with ${JSON.stringify(residencyDto)}`,
    );

    const house = await this.repo.findOneBy({ id, active: true });
    if (!house) {
      throw new NotFoundException('house not found');
    }

    const residency = await this.residencyService.createResidency(
      residencyDto,
      house,
    );
    // link newly created residency as current residency
    house.currentResidency = residency;
    await this.repo.save(house);
    // return the house with residency history
    return this.findHouse(id, true);
  }

  async findHouse(id: string, activeOnly?: boolean) {
    if (!id) {
      return null;
    }
    const where: FindOptionsWhere<House> = { id };
    if (activeOnly) where.active = true;

    const house = await this.repo.findOne({
      where,
      relations: {
        currentResidency: true,
        residencyHistory: true,
      },
    });
    return this.transformToDto(house);
  }

  async findHouses(limit: number, page: number, activeOnly?: boolean) {
    const take = !limit || limit <= 0 ? 10 : limit;
    const skip = ((!page || page <= 0 ? 1 : page) - 1) * take;

    const options: FindManyOptions = {
      relations: {
        currentResidency: true,
      },
      order: { updated_at: 'DESC' },
      take: take,
      skip: skip,
    };
    if (activeOnly) options.where = { active: true };

    const [result, total] = await this.repo.findAndCount(options);

    return {
      data: result.map((house) => {
        return { ...house, ...this.transformToDto(house) };
      }),
      count: total,
    };
  }

  async pruneHouses(date: Date) {
    this.logger.log(`Pruning houses older than ${date}`);

    const idsOfHousesToPrune = (
      await this.repo.find({
        where: {
          updated_at: LessThan(date),
          active: true,
        },
      })
    ).map((house) => house.id);
    console.log(idsOfHousesToPrune);

    await this.repo
      .createQueryBuilder()
      .update(House)
      .set({ active: false })
      .whereInIds(idsOfHousesToPrune)
      .execute();
  }

  private transformFromDto(
    dto: CreateHouseDto | UpdateHouseInfoDto,
  ): Partial<House> {
    return {
      ...dto,
      lat: dto.lat.toString(),
      lng: dto.lng.toString(),
    };
  }

  private transformToDto(house: House) {
    return {
      ...house,
      lat: parseFloat(house.lat),
      lng: parseFloat(house.lng),
    };
  }
}
