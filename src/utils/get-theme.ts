import { PresetTheme } from 'src/dto/config-chart.query.dto';

export const getTheme = (themeName: PresetTheme) => {
  return (
    {
      [PresetTheme.GREEN]: [
        '#ebedf0',
        '#c6e48b',
        '#7bc96f',
        '#239a3b',
        '#196027',
      ],
      [PresetTheme.RED]: [
        '#ebedf0',
        '#d884a4',
        '#c96c8f',
        '#bb547b',
        '#ac3c67',
        '#9e2453',
        '#900c3f',
      ],
      [PresetTheme.PURPLE]: [
        '#ebedf0',
        '#b394f1',
        '#9d78e7',
        '#885cde',
        '#7341d5',
        '#5e25cc',
        '#490ac4',
      ],
      [PresetTheme.BLUE]: [
        '#ebedf0',
        '#a6cadd',
        '#87aacc',
        '#698bbc',
        '#4b6cab',
        '#2d4d9b',
        '#0f2e8b',
      ],
    }[themeName] || getTheme(PresetTheme.GREEN)
  );
};
