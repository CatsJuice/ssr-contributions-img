import { ConfigItem } from '../config.constant';

export const cubeAnimationSpinCfgs: ConfigItem[] = [
  {
    key: 'animation_duration',
    label: {
      en: 'Animation duration(s)',
      zh: '动画时长(单位：秒)',
    },
    type: 'float',
    default: 1,
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
