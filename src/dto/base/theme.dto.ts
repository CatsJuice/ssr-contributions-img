import { Transform } from 'class-transformer';
import { PresetTheme } from 'src/types/theme.enum';
import { decorate } from 'ts-mixer';

export class ThemeDto {
  /**
   * Preset colors
   */
  @decorate(Transform(({ value }) => (value ? value.toLowerCase() : value)))
  theme?: PresetTheme;
}
