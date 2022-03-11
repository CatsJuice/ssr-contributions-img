export enum WidgetSize {
  SMALL = 'small',
  MIDIUM = 'midium',
  LARGE = 'large',
}

export class WidgetSizeDto {
  /**
   * ios Widget size, Affect weeks
   * @default {"midium"}
   */
  widget_size?: WidgetSize;
}
