import { Transform } from 'class-transformer';
import { decorate } from 'ts-mixer';
import { IsOptional, IsNumber } from 'class-validator';

export class WeeksDto {
  /**
   * weeks_count, int [1, 50]
   * @default {16}
   */
  @decorate(
    Transform(({ value }) => Math.max(0, Math.min(50, parseInt(value, 10)))),
  )
  @decorate(IsOptional())
  @decorate(IsNumber())
  weeks?: number;
}
