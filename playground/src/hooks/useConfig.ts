import { ref } from 'vue';
import { useStorage, useWindowSize } from '@vueuse/core';
import { computed } from '@vue/reactivity';
import { getConfig } from '../api/get-config';
import { getWall } from '../api/get-wall';

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
  type: 'enum' | 'int' | 'float' | 'colors' | 'boolean' | 'point';
  default?: any;
  required?: boolean;
  description?: any;
  optioins?: Choice[];
  min?: number;
  max?: number;
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

const state = useStorage('__cfgState', {} as Record<string, any>);
const darkMode = computed(() => !!state.value['dark']);
const activeReqParams = ref(
  {} as {
    username: string;
    query: Record<string, string>;
  },
);

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
      .map(([key, value]) => `${key}=${value}`)
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
    const value = activeReqParams.value?.query?.theme || dft;
    const theme = themeOptions.value.find((item) => item.value === value);
    return theme;
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
    loadSvg();
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
    loadingSvg,
    configItems,
    themeOptions,
    localeOptions,
    loadingConfig,
    selectedTheme,
    confirmDisabled,

    confirm,
    loadSvg,
  };
}
