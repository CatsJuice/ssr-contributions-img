import { decorate, Mixin } from 'ts-mixer';
import { Transform } from 'class-transformer';
import { IsNumber, Min, Max, IsBoolean, IsString } from 'class-validator';
import { IsEnum, IsInt, IsOptional, isArray } from 'class-validator';
import { CalendarChart3DConfig } from '../types/chart-config.interface';

import { DarkDto } from './base/dark.dto';
import { ThemeDto } from './base/theme.dto';
import { WeeksDto } from './base/weeks.dto';
import { ColorsDto } from './base/colors.dto';
import { QualityDto } from './base/quality.dto';
import { WidgetSizeDto } from './base/widget-size.dto';
import { OutputFormatDto } from './base/output-format.dto';
import { Bar3DAnimation } from '../types/3dbar-animation.enum';
import {
  Bar3DLegendDirection,
  Bar3DLegendPosition,
} from '../types/3dbar-legend.enum';

export enum ChartTpl {
  CALENDAR = 'calendar',
  BAR3D = '3dbar',
}

const normalizeColorInput = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim();
  if (!normalized) return undefined;
  return /^(?:[\da-fA-F]{3}|[\da-fA-F]{4}|[\da-fA-F]{6}|[\da-fA-F]{8})$/.test(
    normalized,
  )
    ? `#${normalized}`
    : normalized;
};

const normalizeBooleanInput = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return value;
};

const normalizeEnumInput = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toLowerCase();
  return normalized || undefined;
};

const normalizeLegendPositionInput = (value: unknown) => {
  if (typeof value !== 'string') return value;
  const normalized = value.trim().toLowerCase().replace(/[_-]/g, '');
  if (!normalized) return undefined;

  return (
    {
      top: Bar3DLegendPosition.TOP,
      right: Bar3DLegendPosition.RIGHT,
      bottom: Bar3DLegendPosition.BOTTOM,
      left: Bar3DLegendPosition.LEFT,
      topright: Bar3DLegendPosition.TOP_RIGHT,
      bottomleft: Bar3DLegendPosition.BOTTOM_LEFT,
    }[normalized] || value
  );
};

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
  @decorate(
    Transform(({ value, obj }) => normalizeBooleanInput(value ?? obj?.lengend)),
  )
  @decorate(IsBoolean())
  legend?: boolean;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => normalizeLegendPositionInput(value)))
  @decorate(IsEnum(Bar3DLegendPosition))
  legendPosition?: Bar3DLegendPosition;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => normalizeEnumInput(value)))
  @decorate(IsEnum(Bar3DLegendDirection))
  legendDirection?: Bar3DLegendDirection;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => normalizeColorInput(value)))
  @decorate(IsString())
  foregroundColor?: string;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => parseFloat(value)))
  @decorate(IsNumber())
  @decorate(Min(0))
  @decorate(Max(20))
  strokeWidth?: number;

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => normalizeColorInput(value)))
  @decorate(IsString())
  strokeColor?: string;

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

  @decorate(Transform(({ value }) => value && value.toLowerCase() === 'true'))
  @decorate(IsOptional())
  @decorate(IsBoolean())
  animation_reverse?: boolean;
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

  @decorate(IsOptional())
  @decorate(Transform(({ value }) => normalizeColorInput(value)))
  @decorate(IsString())
  backgroundColor?: string;
}
