import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateHouseStatusDto } from './dtos/update-house-status.dto';
import { GetHousesDto } from './dtos/get-houses.dto';
import { GetHouseDto } from './dtos/get-house.dto';

/*
  Provides api admin operations
*/
@Controller({ path: 'admin', version: '1' })
export class AdminController {
  constructor(private adminService: AdminService) {}

  // find one house
  @Get('/:id')
  async findOneHouse(@Param('id') id: string, @Query() query: GetHouseDto) {
    const house = await this.adminService.findHouse(id, query);
    if (!house) {
      throw new NotFoundException('house not found');
    }
    return house;
  }

  // find all houses
  @Get()
  findAllHouses(@Query() query: GetHousesDto) {
    return this.adminService.findHouses(query);
  }

  // update house activity status
  @Patch('/:id/status')
  updateHouseStatus(
    @Param('id') id: string,
    @Body() body: UpdateHouseStatusDto,
  ) {
    return this.adminService.updateStatus(id, body.active);
  }
}
