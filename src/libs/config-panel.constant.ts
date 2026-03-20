export type Locale = 'en' | 'zh';

export interface ConfigPanelSection {
  key: string;
  label: Record<Locale, string>;
  description?: Record<Locale, string>;
  order: number;
}

export interface ConfigPanelMeta {
  tab: ConfigPanelSection;
  group: ConfigPanelSection;
  order: number;
}

export const configTabs = {
  general: {
    key: 'general',
    label: {
      en: 'General',
      zh: '通用',
    },
    order: 10,
  },
  bar3d: {
    key: 'bar3d',
    label: {
      en: '3D Bar',
      zh: '3D 柱图',
    },
    order: 20,
  },
  animation: {
    key: 'animation',
    label: {
      en: 'Animation',
      zh: '动画',
    },
    order: 30,
  },
} as const;

export const configGroups = {
  generalChart: {
    key: 'general-chart',
    label: {
      en: 'Chart & Range',
      zh: '图表与范围',
    },
    order: 10,
  },
  generalTheme: {
    key: 'general-theme',
    label: {
      en: 'Theme & Colors',
      zh: '主题与颜色',
    },
    order: 20,
  },
  generalOutput: {
    key: 'general-output',
    label: {
      en: 'Output',
      zh: '输出',
    },
    order: 30,
  },
  bar3dStructure: {
    key: 'bar3d-structure',
    label: {
      en: 'Structure',
      zh: '立体结构',
    },
    order: 10,
  },
  bar3dSurface: {
    key: 'bar3d-surface',
    label: {
      en: 'Lighting & Fill',
      zh: '光照与填充',
    },
    order: 20,
  },
  bar3dLegend: {
    key: 'bar3d-legend',
    label: {
      en: 'Legend',
      zh: '图例',
    },
    order: 30,
  },
  bar3dStroke: {
    key: 'bar3d-stroke',
    label: {
      en: 'Stroke',
      zh: '描边',
    },
    order: 40,
  },
  animationMode: {
    key: 'animation-mode',
    label: {
      en: 'Mode',
      zh: '动画模式',
    },
    order: 10,
  },
  animationEntrance: {
    key: 'animation-entrance',
    label: {
      en: 'Entrance',
      zh: '入场动画',
    },
    order: 20,
  },
  animationWave: {
    key: 'animation-wave',
    label: {
      en: 'Wave',
      zh: '波浪动画',
    },
    order: 30,
  },
  animationMess: {
    key: 'animation-mess',
    label: {
      en: 'Mess',
      zh: '杂乱动画',
    },
    order: 40,
  },
  animationSpin: {
    key: 'animation-spin',
    label: {
      en: 'Spin',
      zh: '旋转动画',
    },
    order: 50,
  },
  animationFade: {
    key: 'animation-fade',
    label: {
      en: 'Fade',
      zh: '淡入动画',
    },
    order: 60,
  },
} as const;

export function withPanel<T extends object>(
  item: T,
  tab: ConfigPanelSection,
  group: ConfigPanelSection,
  order: number,
): T & { panel: ConfigPanelMeta } {
  return {
    ...item,
    panel: {
      tab,
      group,
      order,
    },
  };
}
