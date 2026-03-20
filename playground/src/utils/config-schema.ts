import type {
  ConfigGroup,
  ConfigItem,
  ConfigPanelSlot,
  ConfigTab,
  LocalizedChoice,
  LocalizedConfigItem,
  LocalizedConfigPanelSlot,
  LocalizedText,
  Locale,
} from '../types/config';

function localizeText(value: LocalizedText | undefined, locale: Locale) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.en || Object.values(value)[0] || '';
}

function localizePanelSlot(
  slot: ConfigPanelSlot | undefined,
  locale: Locale,
  fallback: {
    key: string;
    label: string;
    order: number;
  },
): LocalizedConfigPanelSlot {
  if (!slot) return fallback;
  return {
    ...slot,
    label: localizeText(slot.label, locale),
    description: localizeText(slot.description, locale) || undefined,
    order: slot.order ?? fallback.order,
  };
}

function sortByOrder<T extends { order?: number; label?: string }>(
  prev: T,
  next: T,
) {
  const orderDiff = (prev.order ?? Number.MAX_SAFE_INTEGER) -
    (next.order ?? Number.MAX_SAFE_INTEGER);
  if (orderDiff !== 0) return orderDiff;
  return `${prev.label || ''}`.localeCompare(`${next.label || ''}`);
}

export function resolveConfigItems(
  schema: ConfigItem[],
  values: Record<string, any>,
  locale: Locale,
): LocalizedConfigItem[] {
  const items: LocalizedConfigItem[] = [];

  const walk = (cfg: ConfigItem) => {
    const current = JSON.parse(JSON.stringify(cfg)) as ConfigItem;
    const options = current.optioins || [];
    const nextConfigs: ConfigItem[] = [];

    if (current.type === 'enum' && options.length) {
      const selectedValue = values[current.key];
      for (const option of options) {
        if (option.value == selectedValue && option.config?.length) {
          nextConfigs.push(...option.config);
        }
        delete option.config;
      }
    }

    items.push({
      ...current,
      label: localizeText(current.label, locale),
      description: localizeText(current.description, locale) || undefined,
      optioins: options.map(
        (option) =>
          ({
            ...option,
            label: localizeText(option.label, locale),
          }) as LocalizedChoice,
      ),
      panel: current.panel
        ? {
            order: current.panel.order,
            tab: localizePanelSlot(current.panel.tab, locale, {
              key: 'general',
              label: locale === 'zh' ? '通用' : 'General',
              order: 10,
            }),
            group: localizePanelSlot(current.panel.group, locale, {
              key: 'misc',
              label: locale === 'zh' ? '其他' : 'Misc',
              order: 999,
            }),
          }
        : undefined,
    });

    nextConfigs.forEach(walk);
  };

  schema.forEach(walk);
  return items;
}

export function buildConfigTabs(
  items: LocalizedConfigItem[],
  locale: Locale,
): ConfigTab[] {
  const tabs = new Map<
    string,
    {
      key: string;
      label: string;
      description?: string;
      order: number;
      groups: Map<string, ConfigGroup>;
    }
  >();

  for (const item of items) {
    const tab = localizePanelSlot(item.panel?.tab, locale, {
      key: 'general',
      label: locale === 'zh' ? '通用' : 'General',
      order: 10,
    });
    const group = localizePanelSlot(item.panel?.group, locale, {
      key: 'misc',
      label: locale === 'zh' ? '其他' : 'Misc',
      order: 999,
    });

    if (!tabs.has(tab.key)) {
      tabs.set(tab.key, {
        key: tab.key,
        label: tab.label,
        description: tab.description,
        order: tab.order ?? 999,
        groups: new Map(),
      });
    }

    const currentTab = tabs.get(tab.key)!;
    if (!currentTab.groups.has(group.key)) {
      currentTab.groups.set(group.key, {
        key: group.key,
        label: group.label,
        description: group.description,
        order: group.order ?? 999,
        items: [],
      });
    }

    currentTab.groups.get(group.key)!.items.push(item);
  }

  return [...tabs.values()]
    .sort(sortByOrder)
    .map((tab) => ({
      key: tab.key,
      label: tab.label,
      description: tab.description,
      order: tab.order,
      groups: [...tab.groups.values()]
        .sort(sortByOrder)
        .map((group) => ({
          ...group,
          items: [...group.items].sort((prev, next) =>
            sortByOrder(
              {
                order: prev.panel?.order,
                label: prev.label,
              },
              {
                order: next.panel?.order,
                label: next.label,
              },
            ),
          ),
        })),
    }));
}
