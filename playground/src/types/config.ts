export type Locale = 'en' | 'zh';

export type LocalizedText = Record<Locale, string> | string;

export interface ConfigPanelSlot {
  key: string;
  label: LocalizedText;
  description?: LocalizedText;
  order?: number;
}

export interface ConfigPanelMeta {
  tab: ConfigPanelSlot;
  group: ConfigPanelSlot;
  order?: number;
}

export interface Choice {
  value: string;
  label: LocalizedText;
  config?: ConfigItem[];
  info?: Record<string, any>;
}

export interface ConfigItem {
  key: string;
  label: LocalizedText;
  type: 'enum' | 'int' | 'float' | 'colors' | 'color' | 'boolean' | 'point';
  default?: any;
  required?: boolean;
  description?: LocalizedText;
  optioins?: Choice[];
  min?: number;
  max?: number;
  panel?: ConfigPanelMeta;
}

export interface LocalizedChoice extends Omit<Choice, 'label'> {
  label: string;
}

export interface LocalizedConfigPanelSlot extends Omit<ConfigPanelSlot, 'label'> {
  label: string;
  description?: string;
}

export interface LocalizedConfigPanelMeta
  extends Omit<ConfigPanelMeta, 'tab' | 'group'> {
  tab: LocalizedConfigPanelSlot;
  group: LocalizedConfigPanelSlot;
}

export interface LocalizedConfigItem
  extends Omit<ConfigItem, 'label' | 'description' | 'optioins' | 'panel'> {
  label: string;
  description?: string;
  optioins?: LocalizedChoice[];
  panel?: LocalizedConfigPanelMeta;
}

export interface ConfigGroup {
  key: string;
  label: string;
  description?: string;
  order: number;
  items: LocalizedConfigItem[];
}

export interface ConfigTab {
  key: string;
  label: string;
  description?: string;
  order: number;
  groups: ConfigGroup[];
}
