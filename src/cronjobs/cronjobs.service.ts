import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HouseService } from '../house/house.service';

/*
  Performs cron jobs
*/
@Injectable()
export class CronjobsService {
  private readonly logger = new Logger(CronjobsService.name);

  constructor(@Inject(HouseService) private houseService: HouseService) {}

  /*
    Prunes houses that have been inactive for a year. 
    Called once per day at 1am
  */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  pruneInactiveHouses() {
    const pruneFromDate = new Date();
    pruneFromDate.setFullYear(pruneFromDate.getFullYear() - 1);
    const affected = this.houseService.pruneHouses(pruneFromDate);
    this.logger.log(`Prune cron job ran affecting ${affected} houses`);
    return affected;
  }
}
