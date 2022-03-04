export enum OutputFormat {
  SVG_FILE = 'svg',
  SVG_RAW = 'svg_raw',
}

export class ConfigChartQueryDto {
  format: OutputFormat;
}
