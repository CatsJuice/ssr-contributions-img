export enum OutputFormat {
  SVG = 'svg',
  XML = 'xml',
  PNG = 'png',
  HTML = 'html',
}

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
}

export class ConfigChartQueryDto {
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
   * Response type
   * @default {"html"}
   */
  format?: OutputFormat;

  /**
   * png quality, only works when format=png, [0.1, 10]
   * @default {1}
   */
  quality?: number;

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
  colors?: string;
}
