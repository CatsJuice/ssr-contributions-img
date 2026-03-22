import { PresetTheme } from '../types/theme.enum';

type ThemePalette = {
  levels: string[];
  background?: string;
  textMain?: string;
  textSub?: string;
  grid?: string;
  stroke1?: string;
  stroke2?: string;
};

type ThemeDefinition = {
  dark: ThemePalette;
  light: ThemePalette;
};

const createPalette = (
  levels: string[],
  palette: Omit<ThemePalette, 'levels'> = {},
): ThemePalette => ({
  levels,
  ...palette,
});

const createTheme = (dark: string[], light: string[]): ThemeDefinition => ({
  dark: createPalette(dark),
  light: createPalette(light),
});

const createDetailedTheme = (
  dark: string[],
  light: string[],
  darkPalette: Omit<ThemePalette, 'levels'> = {},
  lightPalette: Omit<ThemePalette, 'levels'> = {},
): ThemeDefinition => ({
  dark: createPalette(dark, darkPalette),
  light: createPalette(light, lightPalette),
});

const mirrorTheme = (palette: ThemePalette): ThemeDefinition => ({
  dark: palette,
  light: palette,
});

export const themeDefinitions: Record<PresetTheme, ThemeDefinition> = {
  [PresetTheme.GREEN]: createTheme(
    ['#2D3135', '#13451D', '#1A782D', '#1EBB3E', '#00E52E'],
    ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
  ),
  [PresetTheme.DARK_GREEN]: createTheme(
    ['#2D3135', '#0C4739', '#247C6A', '#22A58A', '#00E8B8'],
    ['#EBEDF0', '#BAD7D2', '#64A394', '#247C6A', '#0F5443'],
  ),
  [PresetTheme.RED]: createTheme(
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
  ),
  [PresetTheme.PURPLE]: createTheme(
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
  ),
  [PresetTheme.BLUE]: createTheme(
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
  ),
  [PresetTheme.YELLOW]: createTheme(
    ['#2D3135', '#6D6442', '#D78C16', '#C9A92A', '#DEB921', '#FFD600'],
    ['#ebedf0', '#F9E79F', '#F4D03F', '#F1C40F', '#F39C12', '#D35400'],
  ),
  [PresetTheme.CYAN]: createTheme(
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
  ),
  [PresetTheme.YELLOW_WINE]: createTheme(
    ['#2D3135', '#662142', '#AC464A', '#D85B34', '#E89C32', '#FFDA00'],
    ['#E3E3E3', '#E8D45E', '#DEA453', '#D9603A', '#AC464A', '#6B1F44'],
  ),
  [PresetTheme.PINK]: createTheme(
    ['#2D3135', '#8F1A64', '#A63D7A', '#D64690', '#E33479', '#FF0065'],
    ['#EBEDF0', '#ffc0cb', '#f195b9', '#e36aa8', '#d53f96', '#c71585'],
  ),
  [PresetTheme.SUNSET]: createTheme(
    ['#2D3135', '#2E1B77', '#5a1459', '#91145c', '#c8135e', '#ff1361'],
    ['#EBEDF0', '#DDD7F5', '#FFA8CD', '#FF73AF', '#db357c', '#ff1361'],
  ),
  [PresetTheme.NATIVE]: createTheme(
    ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353'],
    ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  ),
  [PresetTheme.PURPLE_NEBULA]: mirrorTheme(
    createPalette(['#241F31', '#6654AD', '#855CF8', '#A855F7', '#D946EF'], {
      background: '#0F0C18',
      textMain: '#F2EEFF',
      textSub: '#B4AAD4',
      grid: '#342C4A',
      stroke1: '#110C1C',
      stroke2: '#08060E',
    }),
  ),
  [PresetTheme.BLUE_ORBIT]: mirrorTheme(
    createPalette(['#13233A', '#1B4A99', '#2563EB', '#388BFD', '#60A5FA'], {
      background: '#081222',
      textMain: '#E8F3FF',
      textSub: '#92ADCC',
      grid: '#1D334C',
    }),
  ),
  [PresetTheme.SUNSET_EMBER]: mirrorTheme(
    createPalette(['#2F181F', '#993446', '#EA580C', '#F97316', '#FB923C'], {
      background: '#190D12',
      textMain: '#FFEFE5',
      textSub: '#D6A493',
      grid: '#4A262E',
    }),
  ),
  [PresetTheme.TEAL_LAGOON]: mirrorTheme(
    createPalette(['#10292B', '#115E59', '#0D9488', '#14B8A6', '#2DD4BF'], {
      background: '#081819',
      textMain: '#E6FCFA',
      textSub: '#90C1BE',
      grid: '#1C3F41',
    }),
  ),
  [PresetTheme.ROSE_PULSE]: mirrorTheme(
    createPalette(['#2E1823', '#BE185D', '#E11D48', '#F43F5E', '#FB7185'], {
      background: '#1B0C14',
      textMain: '#FFEBF4',
      textSub: '#E2A7BF',
      grid: '#56283A',
      stroke1: '#14080E',
      stroke2: '#0A0408',
    }),
  ),
  [PresetTheme.AMBER_FORGE]: mirrorTheme(
    createPalette(['#332310', '#B45309', '#D97706', '#F59E0B', '#FBBF24'], {
      background: '#1C1208',
      textMain: '#FFF5DC',
      textSub: '#DBB878',
      grid: '#573D19',
      stroke1: '#140C04',
      stroke2: '#0A0602',
    }),
  ),
  [PresetTheme.EMERALD_CANOPY]: mirrorTheme(
    createPalette(['#132B1D', '#059669', '#10B981', '#34D399', '#6EE7B7'], {
      background: '#081910',
      textMain: '#E5FCF0',
      textSub: '#90CCA9',
      grid: '#1C5234',
      stroke1: '#05120B',
      stroke2: '#020A06',
    }),
  ),
  [PresetTheme.CYAN_DEPTH]: mirrorTheme(
    createPalette(['#11252F', '#0891B2', '#06B6D4', '#22D3EE', '#67E8F9'], {
      background: '#07141C',
      textMain: '#E4F8FF',
      textSub: '#8FC6D6',
      grid: '#1C4858',
      stroke1: '#050E14',
      stroke2: '#02080C',
    }),
  ),
  [PresetTheme.INDIGO_NIGHT]: mirrorTheme(
    createPalette(['#1A1F3C', '#4338CA', '#4F46E5', '#6366F1', '#818CF8'], {
      background: '#0D1023',
      textMain: '#ECEEFF',
      textSub: '#A5ADDC',
      grid: '#2A3267',
      stroke1: '#090B18',
      stroke2: '#05070F',
    }),
  ),
  [PresetTheme.MONO_SLATE]: mirrorTheme(
    createPalette(['#242424', '#5A5A5A', '#828282', '#B4B4B4', '#E1E1E1'], {
      background: '#121212',
      textMain: '#F2F2F2',
      textSub: '#A0A0A0',
      grid: '#3A3A3A',
      stroke1: '#080808',
      stroke2: '#000000',
    }),
  ),
  [PresetTheme.NEON_HORIZON]: createDetailedTheme(
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
  ),
  [PresetTheme.AURORA_DRIFT]: createDetailedTheme(
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
  ),
  [PresetTheme.LAVA_SURGE]: createDetailedTheme(
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
  ),
  [PresetTheme.FROST_BYTE]: createDetailedTheme(
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
  ),
  [PresetTheme.ACID_RAIN]: createDetailedTheme(
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
  ),
  [PresetTheme.VOLT_RIOT]: createDetailedTheme(
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
  ),
  [PresetTheme.TOXIC_GLITCH]: createDetailedTheme(
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
  ),
  [PresetTheme.PLASMA_STORM]: createDetailedTheme(
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
  ),
  [PresetTheme.CHROME_PULSE]: createDetailedTheme(
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
  ),
  [PresetTheme.CYBER_SAKURA]: createDetailedTheme(
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
  ),
  [PresetTheme.OBSIDIAN_BLOOM]: createDetailedTheme(
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
  ),
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

export const getTheme = (themeName: PresetTheme, dark = false) => {
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
