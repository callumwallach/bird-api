import { IsBoolean } from 'class-validator';

export class UpdateHouseStatusDto {
  @IsBoolean()
  active: boolean;
}
