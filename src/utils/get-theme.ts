import { PresetTheme } from 'src/types/theme.enum';

export const themes: Record<PresetTheme, { dark: string[]; light: string[] }> =
  {
    [PresetTheme.GREEN]: {
      dark: ['#2D3135', '#13451D', '#1A782D', '#1EBB3E', '#00E52E'],
      light: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
    },
    [PresetTheme.DARK_GREEN]: {
      dark: ['#2D3135', '#0C4739', '#247C6A', '#22A58A', '#00E8B8'],
      light: ['#EBEDF0', '#BAD7D2', '#64A394', '#247C6A', '#0F5443'],
    },
    [PresetTheme.RED]: {
      dark: [
        '#2D3135',
        '#65082C',
        '#881E47',
        '#AB3361',
        '#C22D65',
        '#D91962',
        '#FF0061',
      ],
      light: [
        '#ebedf0',
        '#d884a4',
        '#c96c8f',
        '#bb547b',
        '#ac3c67',
        '#9e2453',
        '#900c3f',
      ],
    },
    [PresetTheme.PURPLE]: {
      dark: [
        '#2D3135',
        '#4813AD',
        '#5F27C8',
        '#6B3BC9',
        '#5214CA',
        '#653FFF',
        '#4200FF',
      ],
      light: [
        '#ebedf0',
        '#b394f1',
        '#9d78e7',
        '#885cde',
        '#7341d5',
        '#5e25cc',
        '#490ac4',
      ],
    },
    [PresetTheme.BLUE]: {
      dark: [
        '#2D3135',
        '#1A3483',
        '#2C4B96',
        '#416AB8',
        '#477FD1',
        '#2F89DF',
        '#0066FF',
      ],
      light: [
        '#ebedf0',
        '#a6cadd',
        '#87aacc',
        '#698bbc',
        '#4b6cab',
        '#2d4d9b',
        '#0f2e8b',
      ],
    },
    [PresetTheme.YELLOW]: {
      dark: ['#2D3135', '#6D6442', '#D78C16', '#C9A92A', '#DEB921', '#FFD600'],
      light: ['#ebedf0', '#F9E79F', '#F4D03F', '#F1C40F', '#F39C12', '#D35400'],
    },
    [PresetTheme.CYAN]: {
      dark: [
        '#2D3135',
        '#324A6A',
        '#355674',
        '#417D9D',
        '#4F90B9',
        '#63ADCA',
        '#80C7D9',
      ],
      light: [
        '#A4DBE7',
        '#80C7D9',
        '#63ADCA',
        '#4F90B9',
        '#417D9D',
        '#355674',
        '#324A6A',
      ],
    },
    [PresetTheme.YELLOW_WINE]: {
      dark: ['#2D3135', '#662142', '#AC464A', '#D85B34', '#E89C32', '#FFDA00'],
      light: ['#E3E3E3', '#E8D45E', '#DEA453', '#D9603A', '#AC464A', '#6B1F44'],
    },
    [PresetTheme.PINK]: {
      dark: ['#2D3135', '#8F1A64', '#A63D7A', '#D64690', '#E33479', '#FF0065'],
      light: ['#EBEDF0', '#ffc0cb', '#f195b9', '#e36aa8', '#d53f96', '#c71585'],
    },
    [PresetTheme.SUNSET]: {
      dark: ['#2D3135', '#2E1B77', '#5a1459', '#91145c', '#c8135e', '#ff1361'],
      light: ['#EBEDF0', '#DDD7F5', '#FFA8CD', '#FF73AF', '#db357c', '#ff1361'],
    },
  };

export const getTheme = (themeName: PresetTheme, dark = false) => {
  return themes[themeName]
    ? themes[themeName][dark ? 'dark' : 'light']
    : getTheme(PresetTheme.GREEN, dark);
};
