export enum OutputFormat {
  SVG = 'svg',
  XML = 'xml',
  PNG = 'png',
  HTML = 'html',
  JPEG = 'jpeg',
}

export class OutputFormatDto {
  /**
   * Response type
   * @default {"html"}
   */
  format?: OutputFormat;
}
