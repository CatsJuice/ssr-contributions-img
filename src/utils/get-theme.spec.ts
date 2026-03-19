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

  it('should format preset labels for display', () => {
    expect(formatPresetThemeLabel(PresetTheme.PURPLE_NEBULA)).toBe(
      'Purple Nebula',
    );
  });
});
