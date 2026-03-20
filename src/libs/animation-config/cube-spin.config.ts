import type { ConfigItem } from '../config.constant';
import { configGroups, configTabs, withPanel } from '../config-panel.constant';
import { createAnimationTimingConfigs } from './shared.config';

export const cubeAnimationSpinCfgs: ConfigItem[] = [
  ...createAnimationTimingConfigs(configGroups.animationSpin, {
    duration: 1,
    delay: 0.03,
  }),
  withPanel(
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
    configTabs.animation,
    configGroups.animationSpin,
    30,
  ),
];
