import { decorate } from 'ts-mixer';
import { IsOptional } from 'class-validator';

export class TZDto {
  /**
   * Time Area, default is "Asia/Shanghai"
   * @default {"Asia/Shanghai"}
   * ref: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  @decorate(IsOptional())
  tz?: string;
}
