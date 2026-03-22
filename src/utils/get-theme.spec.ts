import { PresetTheme } from '../types/theme.enum';

import {
  formatPresetThemeLabel,
  getTheme,
  themeDefinitions,
  themeToneDefinitions,
} from './get-theme';

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
    expect(getTheme(PresetTheme.TOXIC_GLITCH, true)).toEqual([
      '#13140C',
      '#2F4A0B',
      '#67A510',
      '#B7F30B',
      '#F7FF63',
    ]);
    expect(getTheme(PresetTheme.TOXIC_GLITCH, false)).toEqual([
      '#FEFFE9',
      '#F1FFB6',
      '#D2F05B',
      '#94CC1D',
      '#577A0B',
    ]);
    expect(getTheme(PresetTheme.DESERT_MIRAGE, true)).toEqual([
      '#1E1610',
      '#7B5A35',
      '#C88A4B',
      '#4CB5A7',
      '#E8FFF7',
    ]);
    expect(getTheme(PresetTheme.DESERT_MIRAGE, false)).toEqual([
      '#FFF8EE',
      '#F2D8A7',
      '#E3A56C',
      '#68C7B9',
      '#177E89',
    ]);
    expect(getTheme(PresetTheme.HOLOGRAM_POP, true)).toEqual([
      '#121626',
      '#4E5DFF',
      '#7AB8FF',
      '#78F0DD',
      '#FFD38A',
    ]);
    expect(getTheme(PresetTheme.HOLOGRAM_POP, false)).toEqual([
      '#FFF8F0',
      '#DDE4FF',
      '#B8EEFF',
      '#A2F3DF',
      '#FFB86C',
    ]);
  });

  it('should format preset labels for display', () => {
    expect(formatPresetThemeLabel(PresetTheme.PURPLE_NEBULA)).toBe(
      'Purple Nebula',
    );
    expect(formatPresetThemeLabel(PresetTheme.ACID_RAIN)).toBe('Acid Rain');
    expect(formatPresetThemeLabel(PresetTheme.CYBER_SAKURA)).toBe(
      'Cyber Sakura',
    );
    expect(formatPresetThemeLabel(PresetTheme.CIRCUIT_BRONZE)).toBe(
      'Circuit Bronze',
    );
  });

  it('should expose primary tones for every theme definition', () => {
    expect(themeDefinitions[PresetTheme.GREEN].primaryTones).toEqual(['green']);
    expect(themeDefinitions[PresetTheme.DESERT_MIRAGE].primaryTones).toEqual([
      'orange',
      'teal',
    ]);
    expect(themeDefinitions[PresetTheme.MONO_SLATE].primaryTones).toEqual([
      'neutral',
    ]);
    expect(themeDefinitions[PresetTheme.HOLOGRAM_POP].primaryTones).toEqual([
      'blue',
      'cyan',
      'orange',
    ]);

    Object.values(themeDefinitions).forEach((definition) => {
      expect(definition.primaryTones.length).toBeGreaterThan(0);
      definition.primaryTones.forEach((toneKey) => {
        expect(themeToneDefinitions[toneKey]).toEqual(
          expect.objectContaining({
            color: expect.any(String),
            name: expect.any(Object),
          }),
        );
      });
    });

    expect(themeToneDefinitions.orange).toEqual(
      expect.objectContaining({
        color: '#E28B3E',
        name: {
          en: 'Orange',
          zh: '橙',
        },
      }),
    );
  });
});
