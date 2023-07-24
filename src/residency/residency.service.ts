import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Residency } from './residency.entity';
import { House } from '../house/house.entity';
import { AddResidencyDto } from './dtos/add-residency.dto';

/*
  Provides residency entity operations
*/
@Injectable()
export class ResidencyService {
  constructor(
    @InjectRepository(Residency) private repo: Repository<Residency>,
  ) {}

  public async createResidency(residencyDto: AddResidencyDto, house: House) {
    const residency = this.repo.create(residencyDto);
    residency.house = house;
    return this.repo.save(residency);
  }
}
