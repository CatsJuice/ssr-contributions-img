import { PresetTheme } from './enums';

export enum ThemeTone {
  RED = 'red',
  ROSE = 'rose',
  ORANGE = 'orange',
  YELLOW = 'yellow',
  LIME = 'lime',
  GREEN = 'green',
  TEAL = 'teal',
  CYAN = 'cyan',
  BLUE = 'blue',
  PURPLE = 'purple',
  NEUTRAL = 'neutral',
}

export type ThemeToneName = {
  en: string;
  zh: string;
};

export type ThemeToneDefinition = {
  color: string;
  name: ThemeToneName;
  order: number;
};

export const themeToneDefinitions: Record<ThemeTone, ThemeToneDefinition> = {
  [ThemeTone.RED]: {
    color: '#D45A5A',
    name: { en: 'Red', zh: '红' },
    order: 10,
  },
  [ThemeTone.ROSE]: {
    color: '#D96C98',
    name: { en: 'Rose', zh: '玫红' },
    order: 20,
  },
  [ThemeTone.ORANGE]: {
    color: '#E28B3E',
    name: { en: 'Orange', zh: '橙' },
    order: 30,
  },
  [ThemeTone.YELLOW]: {
    color: '#D6B34A',
    name: { en: 'Yellow', zh: '黄' },
    order: 40,
  },
  [ThemeTone.LIME]: {
    color: '#9CC94A',
    name: { en: 'Lime', zh: '黄绿' },
    order: 50,
  },
  [ThemeTone.GREEN]: {
    color: '#47A66D',
    name: { en: 'Green', zh: '绿' },
    order: 60,
  },
  [ThemeTone.TEAL]: {
    color: '#2FA89B',
    name: { en: 'Teal', zh: '青绿' },
    order: 70,
  },
  [ThemeTone.CYAN]: {
    color: '#42B7D6',
    name: { en: 'Cyan', zh: '青' },
    order: 80,
  },
  [ThemeTone.BLUE]: {
    color: '#517FE3',
    name: { en: 'Blue', zh: '蓝' },
    order: 90,
  },
  [ThemeTone.PURPLE]: {
    color: '#8A63D2',
    name: { en: 'Purple', zh: '紫' },
    order: 100,
  },
  [ThemeTone.NEUTRAL]: {
    color: '#8C8278',
    name: { en: 'Neutral', zh: '中性' },
    order: 110,
  },
};

export const themeToneList = (Object.keys(
  themeToneDefinitions,
) as ThemeTone[]).map((key) => ({
  key,
  ...themeToneDefinitions[key],
}));

export type ThemePalette = {
  levels: string[];
  background?: string;
  textMain?: string;
  textSub?: string;
  grid?: string;
  stroke1?: string;
  stroke2?: string;
};

export type ThemePaletteDefinition = {
  dark: ThemePalette;
  light: ThemePalette;
};

export type ThemeDefinition = ThemePaletteDefinition & {
  primaryTones: ThemeTone[];
};

const createPalette = (
  levels: string[],
  palette: Omit<ThemePalette, 'levels'> = {},
): ThemePalette => ({
  levels,
  ...palette,
});

const createTheme = (
  dark: string[],
  light: string[],
): ThemePaletteDefinition => ({
  dark: createPalette(dark),
  light: createPalette(light),
});

const createDetailedTheme = (
  dark: string[],
  light: string[],
  darkPalette: Omit<ThemePalette, 'levels'> = {},
  lightPalette: Omit<ThemePalette, 'levels'> = {},
): ThemePaletteDefinition => ({
  dark: createPalette(dark, darkPalette),
  light: createPalette(light, lightPalette),
});

const mirrorTheme = (palette: ThemePalette): ThemePaletteDefinition => ({
  dark: palette,
  light: palette,
});

const defineTheme = (
  primaryTones: ThemeTone[],
  definition: ThemePaletteDefinition,
): ThemeDefinition => ({
  ...definition,
  primaryTones,
});

export const themeDefinitions: Record<PresetTheme, ThemeDefinition> = {
  [PresetTheme.GREEN]: defineTheme([ThemeTone.GREEN], createTheme(
    ['#2D3135', '#13451D', '#1A782D', '#1EBB3E', '#00E52E'],
    ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
  )),
  [PresetTheme.DARK_GREEN]: defineTheme([ThemeTone.TEAL, ThemeTone.GREEN], createTheme(
    ['#2D3135', '#0C4739', '#247C6A', '#22A58A', '#00E8B8'],
    ['#EBEDF0', '#BAD7D2', '#64A394', '#247C6A', '#0F5443'],
  )),
  [PresetTheme.RED]: defineTheme([ThemeTone.RED, ThemeTone.ROSE], createTheme(
    [
      '#2D3135',
      '#65082C',
      '#881E47',
      '#AB3361',
      '#C22D65',
      '#D91962',
      '#FF0061',
    ],
    [
      '#ebedf0',
      '#d884a4',
      '#c96c8f',
      '#bb547b',
      '#ac3c67',
      '#9e2453',
      '#900c3f',
    ],
  )),
  [PresetTheme.PURPLE]: defineTheme([ThemeTone.PURPLE], createTheme(
    [
      '#2D3135',
      '#4813AD',
      '#5F27C8',
      '#6B3BC9',
      '#5214CA',
      '#653FFF',
      '#4200FF',
    ],
    [
      '#ebedf0',
      '#b394f1',
      '#9d78e7',
      '#885cde',
      '#7341d5',
      '#5e25cc',
      '#490ac4',
    ],
  )),
  [PresetTheme.BLUE]: defineTheme([ThemeTone.BLUE], createTheme(
    [
      '#2D3135',
      '#1A3483',
      '#2C4B96',
      '#416AB8',
      '#477FD1',
      '#2F89DF',
      '#0066FF',
    ],
    [
      '#ebedf0',
      '#a6cadd',
      '#87aacc',
      '#698bbc',
      '#4b6cab',
      '#2d4d9b',
      '#0f2e8b',
    ],
  )),
  [PresetTheme.YELLOW]: defineTheme([ThemeTone.YELLOW, ThemeTone.ORANGE], createTheme(
    ['#2D3135', '#6D6442', '#D78C16', '#C9A92A', '#DEB921', '#FFD600'],
    ['#ebedf0', '#F9E79F', '#F4D03F', '#F1C40F', '#F39C12', '#D35400'],
  )),
  [PresetTheme.CYAN]: defineTheme([ThemeTone.CYAN, ThemeTone.BLUE], createTheme(
    [
      '#2D3135',
      '#324A6A',
      '#355674',
      '#417D9D',
      '#4F90B9',
      '#63ADCA',
      '#80C7D9',
    ],
    [
      '#A4DBE7',
      '#80C7D9',
      '#63ADCA',
      '#4F90B9',
      '#417D9D',
      '#355674',
      '#324A6A',
    ],
  )),
  [PresetTheme.YELLOW_WINE]: defineTheme([ThemeTone.YELLOW, ThemeTone.ROSE], createTheme(
    ['#2D3135', '#662142', '#AC464A', '#D85B34', '#E89C32', '#FFDA00'],
    ['#E3E3E3', '#E8D45E', '#DEA453', '#D9603A', '#AC464A', '#6B1F44'],
  )),
  [PresetTheme.PINK]: defineTheme([ThemeTone.ROSE], createTheme(
    ['#2D3135', '#8F1A64', '#A63D7A', '#D64690', '#E33479', '#FF0065'],
    ['#EBEDF0', '#ffc0cb', '#f195b9', '#e36aa8', '#d53f96', '#c71585'],
  )),
  [PresetTheme.SUNSET]: defineTheme([ThemeTone.ROSE, ThemeTone.PURPLE], createTheme(
    ['#2D3135', '#2E1B77', '#5a1459', '#91145c', '#c8135e', '#ff1361'],
    ['#EBEDF0', '#DDD7F5', '#FFA8CD', '#FF73AF', '#db357c', '#ff1361'],
  )),
  [PresetTheme.NATIVE]: defineTheme([ThemeTone.GREEN], createTheme(
    ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353'],
    ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  )),
  [PresetTheme.PURPLE_NEBULA]: defineTheme([ThemeTone.PURPLE], mirrorTheme(
    createPalette(['#241F31', '#6654AD', '#855CF8', '#A855F7', '#D946EF'], {
      background: '#0F0C18',
      textMain: '#F2EEFF',
      textSub: '#B4AAD4',
      grid: '#342C4A',
      stroke1: '#110C1C',
      stroke2: '#08060E',
    }),
  )),
  [PresetTheme.BLUE_ORBIT]: defineTheme([ThemeTone.BLUE], mirrorTheme(
    createPalette(['#13233A', '#1B4A99', '#2563EB', '#388BFD', '#60A5FA'], {
      background: '#081222',
      textMain: '#E8F3FF',
      textSub: '#92ADCC',
      grid: '#1D334C',
    }),
  )),
  [PresetTheme.SUNSET_EMBER]: defineTheme([ThemeTone.RED, ThemeTone.ORANGE], mirrorTheme(
    createPalette(['#2F181F', '#993446', '#EA580C', '#F97316', '#FB923C'], {
      background: '#190D12',
      textMain: '#FFEFE5',
      textSub: '#D6A493',
      grid: '#4A262E',
    }),
  )),
  [PresetTheme.TEAL_LAGOON]: defineTheme([ThemeTone.TEAL], mirrorTheme(
    createPalette(['#10292B', '#115E59', '#0D9488', '#14B8A6', '#2DD4BF'], {
      background: '#081819',
      textMain: '#E6FCFA',
      textSub: '#90C1BE',
      grid: '#1C3F41',
    }),
  )),
  [PresetTheme.ROSE_PULSE]: defineTheme([ThemeTone.ROSE, ThemeTone.RED], mirrorTheme(
    createPalette(['#2E1823', '#BE185D', '#E11D48', '#F43F5E', '#FB7185'], {
      background: '#1B0C14',
      textMain: '#FFEBF4',
      textSub: '#E2A7BF',
      grid: '#56283A',
      stroke1: '#14080E',
      stroke2: '#0A0408',
    }),
  )),
  [PresetTheme.AMBER_FORGE]: defineTheme([ThemeTone.ORANGE, ThemeTone.YELLOW], mirrorTheme(
    createPalette(['#332310', '#B45309', '#D97706', '#F59E0B', '#FBBF24'], {
      background: '#1C1208',
      textMain: '#FFF5DC',
      textSub: '#DBB878',
      grid: '#573D19',
      stroke1: '#140C04',
      stroke2: '#0A0602',
    }),
  )),
  [PresetTheme.EMERALD_CANOPY]: defineTheme([ThemeTone.GREEN], mirrorTheme(
    createPalette(['#132B1D', '#059669', '#10B981', '#34D399', '#6EE7B7'], {
      background: '#081910',
      textMain: '#E5FCF0',
      textSub: '#90CCA9',
      grid: '#1C5234',
      stroke1: '#05120B',
      stroke2: '#020A06',
    }),
  )),
  [PresetTheme.CYAN_DEPTH]: defineTheme([ThemeTone.CYAN], mirrorTheme(
    createPalette(['#11252F', '#0891B2', '#06B6D4', '#22D3EE', '#67E8F9'], {
      background: '#07141C',
      textMain: '#E4F8FF',
      textSub: '#8FC6D6',
      grid: '#1C4858',
      stroke1: '#050E14',
      stroke2: '#02080C',
    }),
  )),
  [PresetTheme.INDIGO_NIGHT]: defineTheme([ThemeTone.BLUE, ThemeTone.PURPLE], mirrorTheme(
    createPalette(['#1A1F3C', '#4338CA', '#4F46E5', '#6366F1', '#818CF8'], {
      background: '#0D1023',
      textMain: '#ECEEFF',
      textSub: '#A5ADDC',
      grid: '#2A3267',
      stroke1: '#090B18',
      stroke2: '#05070F',
    }),
  )),
  [PresetTheme.MONO_SLATE]: defineTheme([ThemeTone.NEUTRAL], mirrorTheme(
    createPalette(['#242424', '#5A5A5A', '#828282', '#B4B4B4', '#E1E1E1'], {
      background: '#121212',
      textMain: '#F2F2F2',
      textSub: '#A0A0A0',
      grid: '#3A3A3A',
      stroke1: '#080808',
      stroke2: '#000000',
    }),
  )),
  [PresetTheme.NEON_HORIZON]: defineTheme([ThemeTone.PURPLE, ThemeTone.ROSE, ThemeTone.ORANGE], createDetailedTheme(
    ['#221428', '#5B21B6', '#8B5CF6', '#EC4899', '#FFB84D'],
    ['#FFF4FB', '#E6D7FF', '#C0A8FF', '#F37BC5', '#FF8E45'],
    {
      background: '#0F0816',
      textMain: '#FFF1FB',
      textSub: '#D9B7D0',
      grid: '#472D52',
      stroke1: '#0A0410',
      stroke2: '#040208',
    },
    {
      background: '#FFF8FC',
      textMain: '#341B39',
      textSub: '#7B5B7E',
      grid: '#E9CFE4',
      stroke1: '#F8E8F2',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.AURORA_DRIFT]: defineTheme([ThemeTone.TEAL, ThemeTone.GREEN, ThemeTone.LIME], createDetailedTheme(
    ['#10221C', '#0F766E', '#14B8A6', '#6EE7B7', '#D9FF6B'],
    ['#F4FFF8', '#CEF7E5', '#88EBC2', '#33C2A4', '#0F8A7A'],
    {
      background: '#061410',
      textMain: '#E8FFF6',
      textSub: '#9CCAB8',
      grid: '#234F43',
      stroke1: '#040B08',
      stroke2: '#010504',
    },
    {
      background: '#F8FFFC',
      textMain: '#16342B',
      textSub: '#53756A',
      grid: '#BFE5D8',
      stroke1: '#E1F5ED',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.LAVA_SURGE]: defineTheme([ThemeTone.RED, ThemeTone.ORANGE, ThemeTone.YELLOW], createDetailedTheme(
    ['#26110F', '#7F1D1D', '#C2410C', '#FB923C', '#FFE082'],
    ['#FFF5EF', '#FFD8C2', '#FFB077', '#F97316', '#B45309'],
    {
      background: '#140805',
      textMain: '#FFF1E8',
      textSub: '#D7A38C',
      grid: '#5C2E20',
      stroke1: '#0D0403',
      stroke2: '#050100',
    },
    {
      background: '#FFF9F5',
      textMain: '#3C1E16',
      textSub: '#8B5C4D',
      grid: '#F0CDBD',
      stroke1: '#F9E6DC',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.FROST_BYTE]: defineTheme([ThemeTone.BLUE, ThemeTone.CYAN], createDetailedTheme(
    ['#101A2E', '#164E63', '#0EA5E9', '#67E8F9', '#E0FBFF'],
    ['#F2FBFF', '#CFEFFF', '#8DDCFF', '#38BDF8', '#1761C4'],
    {
      background: '#07101B',
      textMain: '#EAF9FF',
      textSub: '#9CC6D9',
      grid: '#214664',
      stroke1: '#040A10',
      stroke2: '#010408',
    },
    {
      background: '#F8FDFF',
      textMain: '#14283A',
      textSub: '#5D7F96',
      grid: '#C5DEED',
      stroke1: '#E5F2F8',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.ACID_RAIN]: defineTheme([ThemeTone.LIME, ThemeTone.GREEN], createDetailedTheme(
    ['#171C10', '#365314', '#65A30D', '#A3E635', '#E4FF77'],
    ['#FCFFE8', '#EAF8B5', '#CDEB67', '#98CC28', '#5B8B16'],
    {
      background: '#0C1007',
      textMain: '#F6FFE3',
      textSub: '#BCCB8C',
      grid: '#41591D',
      stroke1: '#070903',
      stroke2: '#020300',
    },
    {
      background: '#FEFFF7',
      textMain: '#243112',
      textSub: '#67784D',
      grid: '#DEE9B8',
      stroke1: '#F2F7DF',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.VOLT_RIOT]: defineTheme([ThemeTone.BLUE, ThemeTone.CYAN, ThemeTone.LIME], createDetailedTheme(
    ['#0E1523', '#124AAD', '#00A1FF', '#00F5FF', '#B7FF5A'],
    ['#F4FBFF', '#D6EEFF', '#8BD4FF', '#2BC7FF', '#7FD31D'],
    {
      background: '#060A11',
      textMain: '#EDF9FF',
      textSub: '#98B8C9',
      grid: '#1D4362',
      stroke1: '#03060A',
      stroke2: '#010204',
    },
    {
      background: '#F8FDFF',
      textMain: '#173046',
      textSub: '#5B7789',
      grid: '#C7DFEA',
      stroke1: '#E7F3F8',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.TOXIC_GLITCH]: defineTheme([ThemeTone.LIME, ThemeTone.GREEN], createDetailedTheme(
    ['#13140C', '#2F4A0B', '#67A510', '#B7F30B', '#F7FF63'],
    ['#FEFFE9', '#F1FFB6', '#D2F05B', '#94CC1D', '#577A0B'],
    {
      background: '#0B0D06',
      textMain: '#F8FFE6',
      textSub: '#C4D09B',
      grid: '#435B17',
      stroke1: '#060703',
      stroke2: '#020200',
    },
    {
      background: '#FFFFF8',
      textMain: '#273311',
      textSub: '#6F7D4E',
      grid: '#E3ECB7',
      stroke1: '#F3F8D8',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.PLASMA_STORM]: defineTheme([ThemeTone.PURPLE, ThemeTone.ROSE, ThemeTone.ORANGE], createDetailedTheme(
    ['#150D25', '#4C1D95', '#7C3AED', '#C026D3', '#FF7A00'],
    ['#FFF7FD', '#E8D8FF', '#C6B0FF', '#F38BFF', '#FFA24A'],
    {
      background: '#090513',
      textMain: '#F7EEFF',
      textSub: '#C7B0DB',
      grid: '#49296C',
      stroke1: '#05030A',
      stroke2: '#010102',
    },
    {
      background: '#FFFBFE',
      textMain: '#331C44',
      textSub: '#7B638E',
      grid: '#E9D8F3',
      stroke1: '#F6EBFB',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.CHROME_PULSE]: defineTheme([ThemeTone.NEUTRAL, ThemeTone.BLUE], createDetailedTheme(
    ['#171717', '#454545', '#7C7C7C', '#B7C8D6', '#F4FBFF'],
    ['#FAFAFA', '#D9E1E8', '#AEBAC4', '#6F8190', '#24445E'],
    {
      background: '#0B0B0B',
      textMain: '#F5F7F8',
      textSub: '#AEB6BB',
      grid: '#40454A',
      stroke1: '#050505',
      stroke2: '#010101',
    },
    {
      background: '#FDFDFD',
      textMain: '#1F2D38',
      textSub: '#61717D',
      grid: '#D5DDE3',
      stroke1: '#EEF2F5',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.CYBER_SAKURA]: defineTheme([ThemeTone.ROSE, ThemeTone.PURPLE], createDetailedTheme(
    ['#1E1020', '#6F1D5C', '#C026D3', '#FF4F9A', '#FFD0E7'],
    ['#FFF5FB', '#FFD7EB', '#FFA3D1', '#F65CA8', '#B0196A'],
    {
      background: '#100713',
      textMain: '#FFF0F7',
      textSub: '#D6B3C6',
      grid: '#5A294D',
      stroke1: '#09040B',
      stroke2: '#030103',
    },
    {
      background: '#FFF9FC',
      textMain: '#3C1732',
      textSub: '#855D79',
      grid: '#F0D6E4',
      stroke1: '#F9E8F1',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.OBSIDIAN_BLOOM]: defineTheme([ThemeTone.TEAL, ThemeTone.LIME], createDetailedTheme(
    ['#0E0F14', '#27324C', '#006D77', '#00C2A8', '#E5FF7A'],
    ['#F8FBFC', '#D7E2E8', '#8BC5CB', '#31BFAE', '#87CC2A'],
    {
      background: '#05070B',
      textMain: '#EFF6F8',
      textSub: '#A0B6BC',
      grid: '#284550',
      stroke1: '#020305',
      stroke2: '#000000',
    },
    {
      background: '#FBFDFC',
      textMain: '#183138',
      textSub: '#59727A',
      grid: '#D1E1E3',
      stroke1: '#EAF3F3',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.DESERT_MIRAGE]: defineTheme([ThemeTone.ORANGE, ThemeTone.TEAL], createDetailedTheme(
    ['#1E1610', '#7B5A35', '#C88A4B', '#4CB5A7', '#E8FFF7'],
    ['#FFF8EE', '#F2D8A7', '#E3A56C', '#68C7B9', '#177E89'],
    {
      background: '#0F0A07',
      textMain: '#FFF4E5',
      textSub: '#C9AD8A',
      grid: '#5D4630',
      stroke1: '#090603',
      stroke2: '#030201',
    },
    {
      background: '#FFFCF6',
      textMain: '#3C2817',
      textSub: '#8A6B53',
      grid: '#E7D6BE',
      stroke1: '#F7EBDD',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.HOLOGRAM_POP]: defineTheme([ThemeTone.BLUE, ThemeTone.CYAN, ThemeTone.ORANGE], createDetailedTheme(
    ['#121626', '#4E5DFF', '#7AB8FF', '#78F0DD', '#FFD38A'],
    ['#FFF8F0', '#DDE4FF', '#B8EEFF', '#A2F3DF', '#FFB86C'],
    {
      background: '#070A13',
      textMain: '#F5F7FF',
      textSub: '#B5C0DD',
      grid: '#334062',
      stroke1: '#04060B',
      stroke2: '#010204',
    },
    {
      background: '#FFFDF9',
      textMain: '#24304A',
      textSub: '#6A7897',
      grid: '#D8E0F1',
      stroke1: '#EFF4FA',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.CIRCUIT_BRONZE]: defineTheme([ThemeTone.ORANGE, ThemeTone.TEAL, ThemeTone.NEUTRAL], createDetailedTheme(
    ['#171310', '#61401C', '#A86A2C', '#D7A86E', '#7EE0CF'],
    ['#FFF8F1', '#F1DABF', '#D5A06C', '#8AC8C2', '#186A66'],
    {
      background: '#0A0806',
      textMain: '#FFF4EA',
      textSub: '#C7A98D',
      grid: '#59412A',
      stroke1: '#050403',
      stroke2: '#010100',
    },
    {
      background: '#FFFCF8',
      textMain: '#3B2718',
      textSub: '#826754',
      grid: '#E8D8C7',
      stroke1: '#F6EEE7',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.LOTUS_ECLIPSE]: defineTheme([ThemeTone.PURPLE, ThemeTone.TEAL, ThemeTone.YELLOW], createDetailedTheme(
    ['#12111E', '#3A2E6B', '#7B3FE4', '#1FAF97', '#FFE082'],
    ['#FCFAFF', '#DDD3FF', '#B79BFF', '#74D8C4', '#B07A00'],
    {
      background: '#070611',
      textMain: '#F7F2FF',
      textSub: '#B9B0D5',
      grid: '#433A71',
      stroke1: '#040309',
      stroke2: '#010102',
    },
    {
      background: '#FFFDFB',
      textMain: '#2D2546',
      textSub: '#6F6690',
      grid: '#E4DCF1',
      stroke1: '#F4EFFB',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.TROPIC_BURST]: defineTheme([ThemeTone.ROSE, ThemeTone.ORANGE, ThemeTone.GREEN], createDetailedTheme(
    ['#191015', '#7A2247', '#F25F4C', '#FFB347', '#5DDBA4'],
    ['#FFF8F4', '#FFD6E0', '#FFAB97', '#FFC56A', '#1EA974'],
    {
      background: '#0C060A',
      textMain: '#FFF2EE',
      textSub: '#D6AFB7',
      grid: '#5D3141',
      stroke1: '#060304',
      stroke2: '#020101',
    },
    {
      background: '#FFFCFA',
      textMain: '#3D2029',
      textSub: '#8B6570',
      grid: '#F0D6DD',
      stroke1: '#F9EBEE',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.DECO_NIGHTS]: defineTheme([ThemeTone.NEUTRAL, ThemeTone.ORANGE, ThemeTone.TEAL], createDetailedTheme(
    ['#161217', '#62405F', '#B76E79', '#F2A541', '#6FD3C1'],
    ['#FFF9F2', '#EADAF0', '#D8A0B0', '#F8C56B', '#2BA89B'],
    {
      background: '#090608',
      textMain: '#FFF5EF',
      textSub: '#C8B1BB',
      grid: '#564152',
      stroke1: '#050304',
      stroke2: '#010101',
    },
    {
      background: '#FFFDFC',
      textMain: '#342531',
      textSub: '#826878',
      grid: '#EBDCE6',
      stroke1: '#F7F0F5',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.SUPERNOVA_CRASH]: defineTheme([ThemeTone.ROSE, ThemeTone.RED, ThemeTone.ORANGE], createDetailedTheme(
    ['#1E0A2D', '#7B1E7A', '#C5227B', '#F15C5C', '#FFC130'],
    ['#FFF2FA', '#FFB3E1', '#FF66B2', '#FF3333', '#FFAA00'],
    {
      background: '#0A0211',
      textMain: '#FFE8F7',
      textSub: '#D1A7C6',
      grid: '#3A1447',
      stroke1: '#050109',
      stroke2: '#000000',
    },
    {
      background: '#FFF9FC',
      textMain: '#380B26',
      textSub: '#8A4E6C',
      grid: '#F4CCEA',
      stroke1: '#FFF0F9',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.VAPORWAVE_DREAM]: defineTheme([ThemeTone.PURPLE, ThemeTone.ROSE, ThemeTone.CYAN], createDetailedTheme(
    ['#1A1A3A', '#355C7D', '#6C5B7B', '#C06C84', '#F67280'],
    ['#F8F4FF', '#E0C3FC', '#8EC5FC', '#A3E8ED', '#98FF98'],
    {
      background: '#0C081A',
      textMain: '#E2FBFF',
      textSub: '#A29BBD',
      grid: '#2A2242',
      stroke1: '#05030C',
      stroke2: '#020106',
    },
    {
      background: '#FBFAFF',
      textMain: '#241E38',
      textSub: '#6F6885',
      grid: '#D3D0E8',
      stroke1: '#F3F0FA',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.QUANTUM_LEAP]: defineTheme([ThemeTone.BLUE, ThemeTone.CYAN], createDetailedTheme(
    ['#050B14', '#0B2046', '#1A49A1', '#00D4FF', '#FFFFFF'],
    ['#F0F8FF', '#BDE0FE', '#A2D2FF', '#0077B6', '#03045E'],
    {
      background: '#02040A',
      textMain: '#E6F5FF',
      textSub: '#8EACC9',
      grid: '#112347',
      stroke1: '#010205',
      stroke2: '#000102',
    },
    {
      background: '#FAFCFF',
      textMain: '#09223D',
      textSub: '#507194',
      grid: '#C8E0F4',
      stroke1: '#EBF4FB',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.DRAGONFIRE_SCALES]: defineTheme([ThemeTone.RED, ThemeTone.ORANGE, ThemeTone.YELLOW], createDetailedTheme(
    ['#140505', '#5C0000', '#A30000', '#FF3300', '#FFCC00'],
    ['#FFF5F0', '#FFBCA3', '#FF7F50', '#DC143C', '#8B0000'],
    {
      background: '#0A0202',
      textMain: '#FFF2E6',
      textSub: '#CCA699',
      grid: '#3D1010',
      stroke1: '#050101',
      stroke2: '#000000',
    },
    {
      background: '#FFFDFB',
      textMain: '#330C05',
      textSub: '#804033',
      grid: '#F0D4CC',
      stroke1: '#FFF2F0',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.HALLOWEEN_PUMPKIN]: defineTheme([ThemeTone.ORANGE, ThemeTone.PURPLE, ThemeTone.LIME], createDetailedTheme(
    ['#1A1121', '#682C00', '#B44C00', '#FF7600', '#93F000'],
    ['#FFF4EA', '#FFC899', '#FF9B4D', '#E66100', '#4C2366'],
    {
      background: '#0E0814',
      textMain: '#F7EDFC',
      textSub: '#B595C7',
      grid: '#291B36',
      stroke1: '#050208',
      stroke2: '#020104',
    },
    {
      background: '#FFFBF7',
      textMain: '#2D1606',
      textSub: '#7A4517',
      grid: '#EDD0B9',
      stroke1: '#FFF0E6',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.NORDIC_FROST]: defineTheme([ThemeTone.NEUTRAL, ThemeTone.BLUE, ThemeTone.CYAN], createDetailedTheme(
    ['#2E3440', '#4C566A', '#5E81AC', '#81A1C1', '#88C0D0'],
    ['#ECEFF4', '#D8DEE9', '#81A1C1', '#5E81AC', '#4C566A'],
    {
      background: '#242933',
      textMain: '#ECEFF4',
      textSub: '#D8DEE9',
      grid: '#3B4252',
      stroke1: '#1C2028',
      stroke2: '#15181E',
    },
    {
      background: '#F8FAFC',
      textMain: '#2E3440',
      textSub: '#4C566A',
      grid: '#E5E9F0',
      stroke1: '#FFFFFF',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.COSMIC_LATTE]: defineTheme([ThemeTone.NEUTRAL, ThemeTone.ORANGE], createDetailedTheme(
    ['#262220', '#54463D', '#8C7665', '#C2A895', '#EAE0D5'],
    ['#F9F6F0', '#E0D4C3', '#BDAB97', '#8F7E6B', '#54463D'],
    {
      background: '#1A1614',
      textMain: '#F2EBE5',
      textSub: '#B3A193',
      grid: '#362E2A',
      stroke1: '#120F0D',
      stroke2: '#0A0807',
    },
    {
      background: '#FEFDFC',
      textMain: '#382E26',
      textSub: '#7A6A5C',
      grid: '#ECE5DB',
      stroke1: '#FFFFFF',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.TOKYO_NIGHT]: defineTheme([ThemeTone.BLUE, ThemeTone.PURPLE, ThemeTone.ROSE], createDetailedTheme(
    ['#1A1B26', '#2E3C64', '#7AA2F7', '#BB9AF7', '#F7768E'],
    ['#D5D6DB', '#96A1DF', '#5A75DF', '#8C6DE4', '#E65D7B'],
    {
      background: '#16161E',
      textMain: '#C0CAF5',
      textSub: '#9AA5CE',
      grid: '#292E42',
      stroke1: '#111117',
      stroke2: '#0B0B0F',
    },
    {
      background: '#E1E2E7',
      textMain: '#3760BF',
      textSub: '#6172B0',
      grid: '#C8C9D1',
      stroke1: '#E8E9ED',
      stroke2: '#FFFFFF',
    },
  )),
  [PresetTheme.AUTUMN_MAPLE]: defineTheme([ThemeTone.ORANGE, ThemeTone.YELLOW, ThemeTone.RED], createDetailedTheme(
    ['#1E1412', '#5A2A22', '#9A3F25', '#D66C23', '#F2AC0A'],
    ['#FCF7F2', '#F2AC0A', '#D66C23', '#9A3F25', '#5A2A22'],
    {
      background: '#120B0A',
      textMain: '#FCEEEB',
      textSub: '#C79F97',
      grid: '#3D221D',
      stroke1: '#0A0605',
      stroke2: '#050303',
    },
    {
      background: '#FFFCFA',
      textMain: '#3B1A14',
      textSub: '#80493F',
      grid: '#F0E3DF',
      stroke1: '#FFFFFF',
      stroke2: '#FFFFFF',
    },
  )),
};

export const themes: Record<PresetTheme, { dark: string[]; light: string[] }> =
  (Object.keys(themeDefinitions) as PresetTheme[]).reduce((dict, themeName) => {
    dict[themeName] = {
      dark: themeDefinitions[themeName].dark.levels,
      light: themeDefinitions[themeName].light.levels,
    };
    return dict;
  }, {} as Record<PresetTheme, { dark: string[]; light: string[] }>);

export const formatPresetThemeLabel = (themeName: string) =>
  themeName
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getTheme = (themeName: PresetTheme, dark = false): string[] => {
  return themes[themeName]
    ? themes[themeName][dark ? 'dark' : 'light']
    : getTheme(PresetTheme.GREEN, dark);
};

export const getRandomTheme = (dark = false) => {
  const allThemes = Object.keys(themes) as PresetTheme[];
  const randomThemeName =
    allThemes[Math.floor(Math.random() * allThemes.length)];
  return getTheme(randomThemeName, dark);
};
