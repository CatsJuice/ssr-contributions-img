import { Transform } from 'class-transformer';
import { decorate } from 'ts-mixer';

export enum WidgetSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export class WidgetSizeDto {
  /**
   * ios Widget size, Affect weeks
   * @default {"medium"}
   */
  @decorate(
    Transform(({ value }) => (value === 'midium' ? WidgetSize.MEDIUM : value)),
  )
  widget_size?: WidgetSize;
}
