import { ConfigItem } from '../config.constant';

export const cubeAnimationFallCfgs: ConfigItem[] = [
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
