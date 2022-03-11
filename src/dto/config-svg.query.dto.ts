import { Transform } from 'class-transformer';
import { IsNumber, Min, Max } from 'class-validator';

import { decorate, Mixin } from 'ts-mixer';
import { ColorsDto } from './base/colors.dto';
import { OutputFormatDto } from './base/output-format.dto';
import { QualityDto } from './base/quality.dto';
import { ThemeDto } from './base/theme.dto';
import { WeeksDto } from './base/weeks.dto';
import { WidgetSizeDto } from './base/widget-size.dto';
import { CalendarChart3DConfig } from 'src/types/chart-config.interface';
import { IsOptional } from 'class-validator';

export enum ChartTpl {
  CALENDAR = 'calendar',
  BAR3D = '3dbar',
}

/**
 * 3D bar chart config
 */
class Bar3DQueryDto implements CalendarChart3DConfig {
  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @decorate(IsNumber())
  @decorate(Min(0))
  @decorate(Max(20))
  gap?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @decorate(IsNumber())
  @decorate(Min(1))
  scale?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @decorate(IsNumber())
  @decorate(Min(1))
  @decorate(Max(60))
  light?: number;
}

export class ConfigSvgQueryDto extends Mixin(
  OutputFormatDto,
  WidgetSizeDto,
  QualityDto,
  ColorsDto,
  WeeksDto,
  ThemeDto,

  Bar3DQueryDto,
) {
  /**
   * which chart to use
   * @default {"calendar"}
   */
  chart?: ChartTpl;
}
