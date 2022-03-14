import { Mixin } from 'ts-mixer';
import { DarkDto } from './base/dark.dto';
import { OutputFormatDto } from './base/output-format.dto';
import { QualityDto } from './base/quality.dto';

export class GetThemeQueryDto extends Mixin(
  OutputFormatDto,
  QualityDto,
  DarkDto,
) {}
