import { Transform } from 'class-transformer';
import { IsOptional, IsArray, IsString } from 'class-validator';
import { isArray } from 'util';
import { Mixin } from 'ts-mixer';
import { OutputFormatDto } from './output-format.dto';
import { QualityDto } from './quality.dto';

export enum WidgetSize {
  SMALL = 'small',
  MIDIUM = 'midium',
  LARGE = 'large',
}

export enum ChartTpl {
  CALENDAR = 'calendar',
}

export enum PresetTheme {
  GREEN = 'green',
  RED = 'red',
  PURPLE = 'purple',
  BLUE = 'blue',
  YELLOW = 'yellow',
}

export class ConfigChartQueryDto extends Mixin(OutputFormatDto, QualityDto) {
  /**
   * Preset colors
   */
  theme?: PresetTheme;

  /**
   * which chart to use
   * @default {"calendar"}
   */
  chart?: ChartTpl;

  /**
   * ios Widget size, Affect weeks
   * @default {"midium"}
   */
  widget_size?: WidgetSize;

  /**
   * weeks_count, int [1, 50]
   * @default {16}
   */
  weeks?: number;

  /**
   * custom colors, hex value join with ","
   * @default {undefined}
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    (isArray(value) ? value : (value || '').split(',')).map((v) => `#${v}`),
  )
  colors?: string[];
}
