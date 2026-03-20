import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import { useStorage, useWindowSize } from '@vueuse/core';

import { getWall } from '../api/get-wall';
import { getConfig } from '../api/get-config';

type Locale = 'en' | 'zh';
interface Choice {
  value: string;
  label: any;
  config?: ConfigItem[];
  info?: Record<string, any>;
}
export interface ConfigItem {
  key: string;
  label: any | string;
  type: 'enum' | 'int' | 'float' | 'colors' | 'color' | 'boolean' | 'point';
  default?: any;
  required?: boolean;
  description?: any;
  optioins?: Choice[];
  min?: number;
  max?: number;
}
interface ActiveThemeState {
  value: string;
  dark: boolean;
  colors: string[];
}

const localeOptions = [
  { label: 'English', value: 'en' as const },
  { label: '中文简体', value: 'zh' as const },
];
const { width } = useWindowSize();
const locale = useStorage('locale', localeOptions[0].value as Locale);
const username = useStorage('githubUsername', 'CatsJuice');
const config = ref([] as ConfigItem[]);
const loadingConfig = ref(false);
const loadingSvg = ref(false);
const svgCode = ref('');
const themeOptions = ref([] as Choice[]);
const activeTheme = ref<ActiveThemeState>({
  value: 'green',
  dark: false,
  colors: [],
});

const state = useStorage('__cfgState', {} as Record<string, any>);
const darkMode = computed(() => !!state.value['dark']);
const activeDarkMode = computed(() => !!activeTheme.value.dark);
const activeReqParams = ref(
  {} as {
    username: string;
    query: Record<string, string>;
  },
);

function normalizeColor(color: string) {
  const value = `${color || ''}`.trim().replace(/^#/, '');
  if (!value) return '';
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return '';
  return `#${value}`;
}

function parseColorsValue(value: unknown) {
  return `${value || ''}`
    .split(',')
    .map((item) => normalizeColor(item))
    .filter(Boolean);
}

function readThemeColors(value: string, dark: boolean): string[] {
  const theme = themeOptions.value.find((item) => item.value === value);
  const themeColors = (theme?.info?.colors || {})[dark ? 'dark' : 'light'];
  const colors = Array.isArray(themeColors)
    ? themeColors.map((item) => normalizeColor(item)).filter(Boolean)
    : [];
  if (colors.length) return colors;
  if (value !== 'green') return readThemeColors('green', dark);
  return dark
    ? ['#2D3135', '#13451D', '#1A782D', '#1EBB3E', '#00E52E']
    : ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'];
}

function syncActiveTheme() {
  const query = activeReqParams.value?.query || {};
  const dark = query.dark === 'true';
  const value = query.theme || 'green';
  const colors = parseColorsValue(query.colors);

  activeTheme.value = {
    value,
    dark,
    colors: colors.length ? colors : readThemeColors(value, dark),
  };
}

export function useConfig() {
  initConfig();

  const configItems = computed(() => {
    if (!config.value?.length) return [];
    const res: ConfigItem[] = [];

    const checkConfig = (cfg: ConfigItem) => {
      cfg = JSON.parse(JSON.stringify(cfg));
      const { key, optioins } = cfg;

      const subConfig: ConfigItem[] = [];
      if (cfg.type === 'enum' && optioins?.length) {
        const value = state.value[key];
        let option;
        for (const item of optioins) {
          if (item.value == value) {
            option = item;
            if (option.config) {
              // option.config.forEach(checkConfig);
              subConfig.push(...option.config);
            }
          }
          delete item.config;
        }
      }

      res.push({
        ...cfg,
        label: cfg.label[locale.value],
        description: cfg.description?.[locale.value],
        optioins: optioins?.map((item) => ({
          ...item,
          label: item.label[locale.value],
        })),
      });
      subConfig.forEach(checkConfig);
    };
    config.value.forEach(checkConfig);
    return res;
  });

  const query = computed(() => {
    return configItems.value.reduce((prev, curr) => {
      const value: any = state.value[curr.key]
        ? `${state.value[curr.key]}`
        : '';
      return value ? { ...prev, [curr.key]: value } : prev;
    }, {} as Record<string, string>);
  });
  const queryStr = computed(() => {
    return Object.entries(query.value)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');
  });
  const confirmDisabled = computed(
    () =>
      JSON.stringify(requestParams.value) ===
      JSON.stringify(activeReqParams.value),
  );
  const requestParams = computed(() => {
    return { query: query.value, username: username.value };
  });
  const selectedTheme = computed(() => {
    const dft = 'green';
    const value = state.value?.theme || dft;
    const theme = themeOptions.value.find((item) => item.value === value);
    return theme;
  });
  const activeAppearance = computed(() => {
    const query = activeReqParams.value?.query || {};
    return {
      dark: activeDarkMode.value,
      theme: query.colors ? '' : query.theme || activeTheme.value.value,
      colors: query.colors || '',
    };
  });

  const isMobile = computed(() => width.value < 768);

  async function loadSvg() {
    if (loadingSvg.value) return;
    loadingSvg.value = true;
    const res = await getWall(activeReqParams.value.username, {
      ...activeReqParams.value.query,
      format: 'svg',
    });
    svgCode.value = res;
    loadingSvg.value = false;
  }

  /**
   * init config
   * @returns
   */
  async function initConfig() {
    if (config.value?.length || loadingConfig.value) return;
    loadingConfig.value = true;
    config.value = await getConfig();
    loadingConfig.value = false;

    // set default value
    const walk = (cfg: ConfigItem) => {
      const key = cfg.key;
      const value = state.value[key];
      if (value === undefined && cfg.default !== undefined) {
        state.value[key] = cfg.default;
      }

      // store themes
      if (key === 'theme' && cfg.optioins) themeOptions.value = cfg.optioins;

      (cfg.optioins || []).forEach((opt) => {
        if (opt.config?.length) {
          opt.config.forEach(walk);
        }
      });
    };
    config.value.forEach(walk);
    confirm();
  }

  function confirm() {
    if (isMobile.value) document.body.scrollTo(0, 0);
    activeReqParams.value = JSON.parse(JSON.stringify(requestParams.value));
    syncActiveTheme();
    loadSvg();
  }

  function usePreset(newState: Record<string, any>) {
    state.value = {
      ...newState,
      dark: newState.dark ?? darkMode.value,
    };
    confirm();
  }

  return {
    state,
    query,
    locale,
    config,
    svgCode,
    queryStr,
    username,
    isMobile,
    darkMode,
    activeDarkMode,
    activeTheme,
    activeAppearance,
    loadingSvg,
    configItems,
    themeOptions,
    localeOptions,
    loadingConfig,
    selectedTheme,
    confirmDisabled,

    confirm,
    loadSvg,
    usePreset,
  };
}
