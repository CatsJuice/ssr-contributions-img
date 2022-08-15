import { ConfigItem } from '../config.constant';
import { cubeAnimationFallCfgs } from './cube-fall.config';

export const cubeAnimationFadeCfgs: ConfigItem[] = [
  ...cubeAnimationFallCfgs,
  {
    key: 'animation_reverse',
    label: {
      en: 'Reverse direction',
      zh: '反向播放',
    },
    type: 'boolean',
    default: false,
    required: false,
    description: {
      en: 'Whether to play the animation in reverse direction',
      zh: '是否反向播放动画',
    },
  },
];
