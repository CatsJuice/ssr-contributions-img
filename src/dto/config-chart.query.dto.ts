export enum OutputFormat {
  SVG = 'svg',
  XML = 'xml',
  PNG = 'png',
  HTML = 'html',
}

export class ConfigChartQueryDto {
  format: OutputFormat;
}
