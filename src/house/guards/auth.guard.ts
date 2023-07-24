import { CanActivate, ExecutionContext, Inject, Logger } from '@nestjs/common';
import { HouseService } from '../../house/house.service';

/*
  Protects a route by ensuring the incoming request contains an X-UBID header
  with a containing ubid that matches a previously registered ubid
*/
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(@Inject(HouseService) private houseService: HouseService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const ubid = request.headers['x-ubid'] as string;
    const resourceId = request.params.id as string;

    if (!ubid || ubid !== resourceId) {
      this.logger.error(
        `Unauthorized: request with ubid:${ubid} is not authorized to access resource ubid:${resourceId}`,
      );
      return false;
    }
    const house = await this.houseService.findHouse(ubid, true);
    return house !== null;
  }
}
