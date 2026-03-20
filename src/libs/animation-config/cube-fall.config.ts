import type { ConfigItem } from '../config.constant';
import { configGroups } from '../config-panel.constant';
import { createAnimationTimingConfigs } from './shared.config';

export const cubeAnimationFallCfgs: ConfigItem[] = createAnimationTimingConfigs(
  configGroups.animationEntrance,
  {
    duration: 3,
    delay: 0.03,
  },
);
