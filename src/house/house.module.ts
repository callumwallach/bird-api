import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseController } from './house.controller';
import { HouseService } from './house.service';
import { House } from './house.entity';
import { ResidencyModule } from '../residency/residency.module';

@Module({
  imports: [TypeOrmModule.forFeature([House]), ResidencyModule],
  controllers: [HouseController],
  providers: [HouseService],
  exports: [HouseService],
})
export class HouseModule {}
