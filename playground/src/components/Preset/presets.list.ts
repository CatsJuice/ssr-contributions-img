type PresetNumericInput = number | `${number}`;
type PresetWaveCenter = `${number}_${number}`;
type PresetFlatten = '0' | '1' | '2';
type PresetAnimation = 'fall' | 'wave' | 'mess';

interface BasePresetConfig {
  gap: number;
  scale: number;
  weeks: number;
  dark?: boolean;
  theme?: string;
}

interface CalendarPresetConfig extends BasePresetConfig {
  chart: 'calendar';
}

interface Bar3dPresetConfig extends BasePresetConfig {
  chart: '3dbar';
  gradient?: boolean;
  flatten?: PresetFlatten;
  format?: '';
  quality?: number;
  strokeWidth?: PresetNumericInput;
  strokeColor?: string;
  animation?: PresetAnimation;
  animation_duration?: PresetNumericInput;
  animation_delay?: PresetNumericInput;
  animation_amplitude?: PresetNumericInput;
  animation_frequency?: PresetNumericInput;
  animation_wave_center?: PresetWaveCenter;
  animation_loop?: boolean;
  animation_reverse?: boolean;
}

export type PresetConfig = CalendarPresetConfig | Bar3dPresetConfig;

export const presets: ReadonlyArray<PresetConfig> = [
  {
    chart: 'calendar',
    gap: 0.6,
    scale: 2,
    weeks: 15,
    dark: false,
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '0',
    format: '',
    quality: 1,
    weeks: 30,
    dark: false,
    theme: 'green',
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '1',
    format: '',
    quality: 1,
    weeks: 30,
    dark: false,
    theme: 'green',
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '2',
    animation: 'fall',
    animation_duration: '2',
    animation_delay: '0.005',
    weeks: 30,
    theme: 'green',
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '1',
    animation: 'wave',
    animation_duration: '4',
    animation_delay: '0.06',
    animation_amplitude: 24,
    animation_frequency: '0.1',
    animation_wave_center: '0_3',
    weeks: 30,
    dark: true,
    theme: 'green',
    animation_loop: true,
    animation_reverse: false,
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '1',
    animation: 'wave',
    animation_duration: '1',
    animation_delay: '0.05',
    animation_amplitude: '20',
    animation_frequency: '0.5',
    animation_wave_center: '0_0',
    weeks: 30,
    dark: true,
    theme: 'green',
    animation_loop: true,
    animation_reverse: false,
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '2',
    animation: 'wave',
    animation_duration: '1',
    animation_delay: '0.05',
    animation_amplitude: '20',
    animation_frequency: '0.5',
    animation_wave_center: '10_0',
    weeks: 30,
    dark: false,
    theme: 'green',
    animation_loop: true,
    animation_reverse: false,
    strokeWidth: 2,
    strokeColor: '222222',
  },

  {
    chart: '3dbar',
    gap: 0.6,
    scale: 2,
    gradient: false,
    flatten: '1',
    animation: 'mess',
    animation_duration: '4',
    animation_delay: '0.06',
    animation_amplitude: 24,
    animation_frequency: '0.1',
    animation_wave_center: '0_3',
    weeks: 30,
    dark: true,
    theme: 'green',
    animation_loop: true,
    animation_reverse: false,
    strokeWidth: 2,
    strokeColor: '222222',
  },
];
