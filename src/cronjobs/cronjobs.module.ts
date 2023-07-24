import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { HouseModule } from '../house/house.module';

@Module({
  imports: [HouseModule],
  providers: [CronjobsService],
})
export class CronjobsModule {}
