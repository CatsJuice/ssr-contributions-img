import { Transform } from 'class-transformer';
import { decorate } from 'ts-mixer';
import { WidgetSize } from '../../../shared/render-core/enums';

export { WidgetSize };

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
