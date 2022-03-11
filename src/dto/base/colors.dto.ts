import { Transform } from 'class-transformer';
import { isArray, IsArray, IsOptional, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';

export class ColorsDto {
  /**
   * custom colors, hex value join with ","
   * @default {undefined}
   */
  @decorate(IsOptional())
  @decorate(IsArray())
  @decorate(IsString({ each: true }))
  @decorate(
    Transform(({ value }) =>
      (isArray(value) ? value : (value || '').split(',')).map((v) => `#${v}`),
    ),
  )
  colors?: string[];
}
