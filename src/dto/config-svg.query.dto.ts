import { decorate, Mixin } from 'ts-mixer';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, isArray } from 'class-validator';
import { IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { CalendarChart3DConfig } from 'src/types/chart-config.interface';

import { DarkDto } from './base/dark.dto';
import { ThemeDto } from './base/theme.dto';
import { WeeksDto } from './base/weeks.dto';
import { ColorsDto } from './base/colors.dto';
import { QualityDto } from './base/quality.dto';
import { WidgetSizeDto } from './base/widget-size.dto';
import { OutputFormatDto } from './base/output-format.dto';
import { Bar3DAnimation } from 'src/types/3dbar-animation.enum';

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

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => value && value.toLowerCase() === 'true'))
  @decorate(IsBoolean())
  gradient?: boolean;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseInt(value)))
  @decorate(IsInt())
  flatten?: number;

  @decorate(IsOptional())
  @decorate(IsEnum(Bar3DAnimation))
  animation?: Bar3DAnimation;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @IsNumber()
  animation_duration?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @IsNumber()
  animation_delay?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @IsNumber()
  animation_amplitude?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @IsNumber()
  @Min(0.01)
  @Max(0.5)
  animation_frequency?: number;

  @decorate(IsOptional())
  @decorate(
    Transform(({ value }) => (isArray(value) ? value : value.split('_'))),
  )
  @IsNumber({ allowNaN: false }, { each: true })
  animation_wave_center?: Array<number>;

  @decorate(Transform(({ value }) => value && value.toLowerCase() === 'true'))
  @decorate(IsOptional())
  @decorate(IsBoolean())
  animation_loop?: boolean;
}

export class ConfigSvgQueryDto extends Mixin(
  OutputFormatDto,
  WidgetSizeDto,
  QualityDto,
  ColorsDto,
  WeeksDto,
  ThemeDto,
  DarkDto,

  Bar3DQueryDto,
) {
  /**
   * which chart to use
   * @default {"calendar"}
   */
  chart?: ChartTpl;
}
