import { Mixin } from 'ts-mixer';
import { ColorsDto } from './base/colors.dto';
import { OutputFormat } from './base/output-format.dto';
import { QualityDto } from './base/quality.dto';
import { ThemeDto } from './base/theme.dto';
import { WeeksDto } from './base/weeks.dto';
import { WidgetSizeDto } from './base/widget-size.dto';

export enum CanvasOutputFormat {
  HTML = OutputFormat.HTML,
  JPEG = OutputFormat.JPEG,
}

export class ConfigCanvasQueryDto extends Mixin(
  WidgetSizeDto,
  QualityDto,
  ColorsDto,
  WeeksDto,
  ThemeDto,
) {
  format: CanvasOutputFormat;
}
