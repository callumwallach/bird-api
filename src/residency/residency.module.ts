import { Module } from '@nestjs/common';
import { ResidencyService } from './residency.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Residency } from './residency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Residency])],
  providers: [ResidencyService],
  exports: [ResidencyService],
})
export class ResidencyModule {}
