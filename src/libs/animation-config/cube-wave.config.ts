import { ConfigItem } from '../config.constant';
import { cubeAnimationFallCfgs } from './cube-fall.config';

export const cubeAnimationWaveCfgs: ConfigItem[] = [
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
