import { PresetTheme } from '../types/theme.enum';

import { formatPresetThemeLabel, getTheme } from './get-theme';

describe('getTheme', () => {
  it('should expose the new preset theme levels', () => {
    expect(getTheme(PresetTheme.PURPLE_NEBULA, true)).toEqual([
      '#241F31',
      '#6654AD',
      '#855CF8',
      '#A855F7',
      '#D946EF',
    ]);
  });

  it('should expose distinct dark and light palettes for the cool dual-mode themes', () => {
    expect(getTheme(PresetTheme.NEON_HORIZON, true)).toEqual([
      '#221428',
      '#5B21B6',
      '#8B5CF6',
      '#EC4899',
      '#FFB84D',
    ]);
    expect(getTheme(PresetTheme.NEON_HORIZON, false)).toEqual([
      '#FFF4FB',
      '#E6D7FF',
      '#C0A8FF',
      '#F37BC5',
      '#FF8E45',
    ]);
  });

  it('should format preset labels for display', () => {
    expect(formatPresetThemeLabel(PresetTheme.PURPLE_NEBULA)).toBe(
      'Purple Nebula',
    );
    expect(formatPresetThemeLabel(PresetTheme.ACID_RAIN)).toBe('Acid Rain');
  });
});
