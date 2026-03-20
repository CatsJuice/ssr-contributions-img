import type { ConfigItem } from '../config.constant';
import { configGroups, configTabs, withPanel } from '../config-panel.constant';
import { createAnimationTimingConfigs } from './shared.config';

export const cubeAnimationFadeCfgs: ConfigItem[] = [
  ...createAnimationTimingConfigs(configGroups.animationFade, {
    duration: 3,
    delay: 0.03,
  }),
  withPanel(
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
    configTabs.animation,
    configGroups.animationFade,
    30,
  ),
];
