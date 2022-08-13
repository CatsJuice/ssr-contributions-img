import { themes } from 'src/utils/get-theme';

import { WidgetSize } from '../dto/base/widget-size.dto';
import { OutputFormat } from '../dto/base/output-format.dto';
import { Bar3DAnimation } from '../types/3dbar-animation.enum';
import { ConfigSvgQueryDto, ChartTpl } from '../dto/config-svg.query.dto';

type Locale = 'en' | 'zh';

export interface ConfigItem {
  key: keyof ConfigSvgQueryDto;
  label: Record<Locale, string>;
  type: 'enum' | 'int' | 'float' | 'colors' | 'boolean' | 'point';
  default?: any;
  required?: boolean;
  description?: Record<Locale, string>;
  optioins?: Choice[];
  min?: number;
  max?: number;
}

interface Choice {
  value: string;
  label: Record<Locale, string>;
  config?: ConfigItem[];
  info?: Record<string, any>;
}

const qualityCfg: ConfigItem = {
  key: 'quality',
  label: {
    en: 'Quality',
    zh: '输出质量',
  },
  type: 'float',
  default: 1,
  required: false,
  description: {
    en: 'Set the quality of jpeg or png',
    zh: '设置jpeg或png输出质量',
  },
  min: 0.1,
  max: 10,
};

const cubeAnimationFallCfgs: ConfigItem[] = [
  {
    key: 'animation_duration',
    label: {
      en: 'Animation duration(s)',
      zh: '动画时长(单位：秒)',
    },
    type: 'float',
    default: 3,
    required: false,
    description: {
      en: 'Set the duration of animation',
      zh: '设置动画时长',
    },
  },

  {
    key: 'animation_delay',
    label: {
      en: 'Animation delay(s)',
      zh: '动画延迟(单位：秒)',
    },
    type: 'float',
    default: 0.03,
    required: false,
    description: {
      en: 'Set the delay of animation',
      zh: '设置动画延迟',
    },
  },
];

const cubeAnimationWaveCfgs: ConfigItem[] = [
  ...cubeAnimationFallCfgs,
  {
    key: 'animation_amplitude',
    label: {
      en: 'Animation amplitude',
      zh: '动画振幅',
    },
    type: 'float',
    default: 24,
    description: {
      en: 'Set the amplitude of wave animation',
      zh: '设置波纹动画振幅',
    },
  },

  {
    key: 'animation_frequency',
    label: {
      en: 'Animation frequency',
      zh: '动画频率',
    },
    type: 'float',
    default: 0.1,
    description: {
      en: 'Set the frequency of wave animation',
      zh: '设置波纹动画频率',
    },
    min: 0.01,
    max: 0.5,
  },

  {
    key: 'animation_wave_center',
    label: {
      en: 'Animation wave center',
      zh: '动画波纹中心',
    },
    type: 'point',
    description: {
      en: 'Set the center of wave animation, x means week index, y means day index',
      zh: '设置波纹动画中心, x表示第几周，y表示第几天',
    },
    default: '19_3',
  },
];

const cubeAnimationMessCfgs: ConfigItem[] = [
  {
    key: 'animation_duration',
    label: {
      en: 'Animation duration(s)',
      zh: '动画时长(单位：秒)',
    },
    type: 'float',
    default: 3,
    required: false,
    description: {
      en: 'Set the duration of animation',
      zh: '设置动画时长',
    },
  },

  {
    key: 'animation_loop',
    label: {
      en: 'Animation loop',
      zh: '循环播放',
    },
    type: 'boolean',
    default: false,
    required: false,
    description: {
      en: 'Whether to play the animation in loop',
      zh: '是否循环播放动画',
    },
  },
];

const bar3dCfg: ConfigItem[] = [
  {
    key: 'gap',
    label: {
      en: 'Cube Gap',
      zh: '立方体间距',
    },
    type: 'float',
    min: 0,
    max: 20,
    default: 0.6,
    description: {
      en: 'Set the gap between cubes',
      zh: '设置立方体间距',
    },
  },
  {
    key: 'scale',
    label: {
      en: 'Cube skew',
      zh: '立方体倾斜',
    },
    default: 2,
    type: 'float',
    min: 1,
    max: 100,
    description: {
      en: 'Set the skew of cubes',
      zh: '设置立方体倾斜',
    },
  },
  {
    key: 'light',
    label: {
      en: 'Light',
      zh: '光照强度',
    },
    type: 'float',
    min: 1,
    max: 60,
    description: {
      en: 'Set the light of cubes',
      zh: '设置立方体光照强度',
    },
  },
  {
    key: 'gradient',
    label: {
      en: 'Gradient Mode',
      zh: '渐变模式',
    },
    type: 'boolean',
    default: false,
    description: {
      en: 'Enable the gradient mode of cubes',
      zh: '启用立方体渐变模式',
    },
  },

  {
    key: 'flatten',
    label: {
      en: 'Flatten',
      zh: '平面化',
    },
    type: 'enum',
    default: '1',
    optioins: [
      { value: '0', label: { en: 'None', zh: '无' } },
      { value: '1', label: { en: 'All', zh: '全部扁平化' } },
      { value: '2', label: { en: 'Ignore Empty', zh: '忽略空值' } },
    ],
    description: {
      en: 'Flatten the cube',
      zh: '平面化立方体',
    },
  },

  {
    key: 'animation',
    label: {
      en: 'Animation',
      zh: '动画',
    },
    type: 'enum',
    default: Bar3DAnimation.WAVE,
    description: {
      en: 'Enable the animation of cubes',
      zh: '启用立方体动画',
    },
    optioins: [
      { value: Bar3DAnimation.NONE, label: { en: 'None', zh: '无' } },
      {
        value: Bar3DAnimation.FALL,
        label: { en: 'fall', zh: '落下' },
        config: cubeAnimationFallCfgs,
      },
      {
        value: Bar3DAnimation.RAISE,
        label: { en: 'rise', zh: '上升' },
        config: cubeAnimationFallCfgs,
      },
      {
        value: Bar3DAnimation.WAVE,
        label: { en: 'wave', zh: '波浪' },
        config: cubeAnimationWaveCfgs,
      },
      {
        value: Bar3DAnimation.MESS,
        label: { en: 'mess', zh: '杂乱' },
        config: cubeAnimationMessCfgs,
      },
    ],
  },
];

export const config: ConfigItem[] = [
  // chart
  {
    key: 'chart',
    label: {
      en: 'Chart',
      zh: '图表模板',
    },
    type: 'enum',
    default: ChartTpl.BAR3D,
    required: false,
    description: {
      en: 'Select which chart you want to generate',
      zh: '选择你要生成的图表模板',
    },
    optioins: [
      { value: ChartTpl.CALENDAR, label: { en: 'Calendar', zh: '日历' } },
      {
        value: ChartTpl.BAR3D,
        label: { en: 'Isometric', zh: '3D日历' },
        config: bar3dCfg,
      },
    ],
  },

  // format
  {
    key: 'format',
    label: {
      en: 'Format',
      zh: '输出格式',
    },
    type: 'enum',
    default: OutputFormat.SVG,
    required: false,
    description: {
      en: 'Select the output format',
      zh: '选择输出格式',
    },
    optioins: [
      { value: OutputFormat.SVG, label: { en: 'SVG', zh: 'SVG' } },
      { value: OutputFormat.XML, label: { en: 'XML', zh: 'XML' } },
      { value: OutputFormat.HTML, label: { en: 'HTML', zh: 'HTML' } },
      {
        value: OutputFormat.PNG,
        label: { en: 'PNG', zh: 'PNG' },
        config: [qualityCfg],
      },
      {
        value: OutputFormat.JPEG,
        label: { en: 'JPEG', zh: 'JPEG' },
        config: [qualityCfg],
      },
    ],
  },

  // weeks
  {
    key: 'weeks',
    label: {
      en: 'Weeks',
      zh: '周数',
    },
    type: 'int',
    default: 40,
    description: {
      en: 'Weeks count, will override the num calculated by widget_size',
      zh: '周数，会覆盖widget_size计算的周数',
    },
    min: 1,
    max: 50,
  },

  // theme
  {
    key: 'theme',
    label: {
      en: 'Theme',
      zh: '主题',
    },
    type: 'enum',
    description: {
      en: 'Select the theme',
      zh: '选择主题',
    },
    optioins: Object.keys(themes).map((themeName) => ({
      value: themeName,
      label: { en: themeName, zh: themeName },
      info: {
        colors: themes[themeName],
      },
    })),
  },

  // widget size
  {
    key: 'widget_size',
    label: {
      en: 'Widget size',
      zh: '组件尺寸',
    },
    type: 'enum',
    required: false,
    description: {
      en: 'Select the widget size of ios',
      zh: '选择ios组件尺寸',
    },
    optioins: [
      { value: WidgetSize.SMALL, label: { en: 'Small', zh: '小' } },
      { value: WidgetSize.MEDIUM, label: { en: 'Medium', zh: '中' } },
      { value: WidgetSize.SMALL, label: { en: 'Large', zh: '大' } },
    ],
  },

  // colors
  {
    key: 'colors',
    label: {
      en: 'Colors',
      zh: '自定义颜色',
    },
    type: 'colors',
    description: {
      en: 'Custom colors, hex value join with ",", will override the theme colors',
      zh: '自定义颜色，十六进制值用","连接, 会覆盖主题颜色',
    },
  },

  // dark
  {
    key: 'dark',
    label: {
      en: 'DarkMode',
      zh: '暗黑模式',
    },
    type: 'boolean',
    default: false,
    description: {
      en: 'Enable darkMode',
      zh: '使用暗黑模式',
    },
  },
];
