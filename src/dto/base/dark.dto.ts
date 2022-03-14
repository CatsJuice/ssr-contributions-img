import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { decorate } from 'ts-mixer';

export class DarkDto {
  @decorate(IsBoolean())
  @decorate(IsOptional())
  @decorate(Transform(({ value }) => value && value.toLowerCase() === 'true'))
  dark?: boolean;
}
