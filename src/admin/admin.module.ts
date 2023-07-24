import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HouseModule } from '../house/house.module';
import { ResidencyModule } from '../residency/residency.module';

@Module({
  imports: [HouseModule, ResidencyModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
