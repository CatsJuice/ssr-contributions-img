import type { ConfigItem } from '../config.constant';
import {
  ConfigPanelSection,
  configTabs,
  withPanel,
} from '../config-panel.constant';

export function createAnimationTimingConfigs(
  group: ConfigPanelSection,
  defaults: {
    duration: number;
    delay?: number;
  },
): ConfigItem[] {
  const configs: ConfigItem[] = [
    withPanel(
      {
        key: 'animation_duration',
        label: {
          en: 'Animation duration(s)',
          zh: '动画时长(单位：秒)',
        },
        type: 'float',
        default: defaults.duration,
        required: false,
        description: {
          en: 'Set the duration of animation',
          zh: '设置动画时长',
        },
      },
      configTabs.animation,
      group,
      10,
    ),
  ];

  if (defaults.delay !== undefined) {
    configs.push(
      withPanel(
        {
          key: 'animation_delay',
          label: {
            en: 'Animation delay(s)',
            zh: '动画延迟(单位：秒)',
          },
          type: 'float',
          default: defaults.delay,
          required: false,
          description: {
            en: 'Set the delay of animation',
            zh: '设置动画延迟',
          },
        },
        configTabs.animation,
        group,
        20,
      ),
    );
  }

  return configs;
}
