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
    ['#2D3135', '#65082C', '#881E47', '#AB3361', '#C22D65', '#D91962', '#FF0061'],
    ['#ebedf0', '#d884a4', '#c96c8f', '#bb547b', '#ac3c67', '#9e2453', '#900c3f'],
  ),
  [PresetTheme.PURPLE]: createTheme(
    ['#2D3135', '#4813AD', '#5F27C8', '#6B3BC9', '#5214CA', '#653FFF', '#4200FF'],
    ['#ebedf0', '#b394f1', '#9d78e7', '#885cde', '#7341d5', '#5e25cc', '#490ac4'],
  ),
  [PresetTheme.BLUE]: createTheme(
    ['#2D3135', '#1A3483', '#2C4B96', '#416AB8', '#477FD1', '#2F89DF', '#0066FF'],
    ['#ebedf0', '#a6cadd', '#87aacc', '#698bbc', '#4b6cab', '#2d4d9b', '#0f2e8b'],
  ),
  [PresetTheme.YELLOW]: createTheme(
    ['#2D3135', '#6D6442', '#D78C16', '#C9A92A', '#DEB921', '#FFD600'],
    ['#ebedf0', '#F9E79F', '#F4D03F', '#F1C40F', '#F39C12', '#D35400'],
  ),
  [PresetTheme.CYAN]: createTheme(
    ['#2D3135', '#324A6A', '#355674', '#417D9D', '#4F90B9', '#63ADCA', '#80C7D9'],
    ['#A4DBE7', '#80C7D9', '#63ADCA', '#4F90B9', '#417D9D', '#355674', '#324A6A'],
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
