import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { HouseService } from './house.service';
import { AuthGuard } from './guards/auth.guard';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseInfoDto } from './dtos/update-house-info.dto';
import { AddResidencyDto } from '../residency/dtos/add-residency.dto';

/*
  Provides api operations on houses
*/
@Controller({ path: 'house', version: '1' })
export class HouseController {
  constructor(private houseService: HouseService) {}

  // register new house
  @Post()
  registerHouse(@Body() body: CreateHouseDto) {
    return this.houseService.create(body);
  }

  // update house info
  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateHouseInfo(@Param('id') id: string, @Body() body: UpdateHouseInfoDto) {
    return this.houseService.updateInfo(id, body);
  }

  // update house residency
  @Post('/:id/residency')
  @UseGuards(AuthGuard)
  addHouseResidency(@Param('id') id: string, @Body() body: AddResidencyDto) {
    return this.houseService.addResidency(id, body);
  }

  // find one house
  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOneHouse(@Param('id') id: string) {
    const house = await this.houseService.findHouse(id);
    if (!house) {
      throw new NotFoundException('house not found');
    }
    return house;
  }
}
