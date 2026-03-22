import type { Choice, ConfigItem, ConfigTab, Locale } from '../types/config';

import { Notify } from 'quasar';
import { computed, ref, watch } from 'vue';
import { useStorage, useWindowSize } from '@vueuse/core';

import { getConfig } from '../api/get-config';
import { getContributions } from '../api/get-contributions';
import { buildConfigTabs, resolveConfigItems } from '../utils/config-schema';
import {
  renderContributionResponseSvg,
  renderMockContributionSvg,
} from '../utils/render-svg';

export type { ConfigItem, ConfigTab, Locale } from '../types/config';

interface ActiveThemeState {
  value: string;
  dark: boolean;
  colors: string[];
}

const CONFIG_RENDER_DEBOUNCE_MS = 180;
const USERNAME_RENDER_DEBOUNCE_MS = 450;

const localeOptions = [
  { label: 'English', value: 'en' as const },
  { label: '中文简体', value: 'zh' as const },
];

const playgroundDefaults = {
  theme: 'rose_pulse',
  dark: true,
  flatten: '0',
  legend: true,
  legendPosition: 'bottomLeft',
  legendDirection: 'row',
  strokeWidth: 2,
  strokeColor: '222222',
} as const;

const { width } = useWindowSize();
const locale = useStorage<Locale>('locale', localeOptions[0].value);
const username = useStorage('githubUsername', 'CatsJuice');
const config = ref([] as ConfigItem[]);
const loadingConfig = ref(false);
const loadingContribution = ref(false);
const renderingSvg = ref(false);
const svgCode = ref('');
const themeOptions = ref([] as Choice[]);
const contributionData = ref<any>(null);

const state = useStorage('__cfgState', {
  ...playgroundDefaults,
} as Record<string, any>);

const initialized = ref(false);
let initPromise: Promise<void> | null = null;
let fetchTimer: ReturnType<typeof setTimeout> | null = null;
let renderTimer: ReturnType<typeof setTimeout> | null = null;
let fetchController: AbortController | null = null;
let renderSequence = 0;

const previewSvgCache = new Map<string, Promise<string>>();

function normalizeColor(color: string) {
  const value = `${color || ''}`.trim().replace(/^#/, '');
  if (!value) return '';
  if (!/^[\da-f]{3}([\da-f]{3})?$/i.test(value)) return '';
  return `#${value}`;
}

function localizeText(value: any, targetLocale = locale.value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[targetLocale] || value.en || Object.values(value)[0] || '';
}

function parseColorsValue(value: unknown) {
  return `${value || ''}`
    .split(',')
    .map((item) => normalizeColor(item))
    .filter(Boolean);
}

function readThemeColors(
  options: Choice[],
  value: string,
  dark: boolean,
): string[] {
  const theme = options.find((item) => item.value === value);
  const themeColors = (theme?.info?.colors || {})[dark ? 'dark' : 'light'];
  const colors = Array.isArray(themeColors)
    ? themeColors.map((item) => normalizeColor(item)).filter(Boolean)
    : [];

  if (colors.length) return colors;
  if (value !== 'green') return readThemeColors(options, 'green', dark);

  return dark
    ? ['#2D3135', '#13451D', '#1A782D', '#1EBB3E', '#00E52E']
    : ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'];
}

function isEmptyValue(value: unknown) {
  return value === undefined || value === null || value === '';
}

function isOmittableQueryValue(value: unknown) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'number') return Number.isNaN(value);
  if (typeof value !== 'string') return false;

  const normalized = value.trim();
  if (!normalized) return true;

  return ['undefined', 'null', 'nan'].includes(normalized.toLowerCase());
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value as Record<string, unknown>)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableSerialize(
            (value as Record<string, unknown>)[key],
          )}`,
      )
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function readThemeOptionList() {
  const rawTheme = config.value.find((item) => item.key === 'theme');
  if (rawTheme?.optioins?.length) {
    themeOptions.value = rawTheme.optioins;
  }
}

function applyDefaults(schema: ConfigItem[]) {
  const walk = (cfg: ConfigItem) => {
    const key = cfg.key;
    const currentValue = state.value[key];
    const playgroundDefaultValue =
      playgroundDefaults[key as keyof typeof playgroundDefaults];
    const defaultValue = playgroundDefaultValue ?? cfg.default;

    if (currentValue === undefined && defaultValue !== undefined) {
      state.value[key] = defaultValue;
    }

    if (key === 'theme' && cfg.optioins?.length) {
      themeOptions.value = cfg.optioins;
    }

    (cfg.optioins || []).forEach((opt) => {
      if (opt.config?.length) opt.config.forEach(walk);
    });
  };

  schema.forEach(walk);
}

const configItems = computed(() => {
  if (!config.value?.length) return [];
  return resolveConfigItems(config.value, state.value, locale.value);
});

const configTabs = computed(() =>
  buildConfigTabs(configItems.value, locale.value),
);

const query = computed(() =>
  configItems.value.reduce((prev, curr) => {
    const value = state.value[curr.key];
    if (isEmptyValue(value) || isOmittableQueryValue(value)) return prev;

    return {
      ...prev,
      [curr.key]: `${value}`,
    };
  }, {} as Record<string, string>),
);

const queryStr = computed(() =>
  Object.entries(query.value)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&'),
);

const darkMode = computed(() => {
  const value = state.value.dark;
  return value === false || value === 'false' ? false : !!value;
});

const loadingSvg = computed(
  () => loadingContribution.value || renderingSvg.value,
);

const localizedThemeOptions = computed(() =>
  themeOptions.value.map((item) => ({
    ...item,
    label: localizeText(item.label),
  })),
);

const selectedTheme = computed(() => {
  const value = `${state.value?.theme || playgroundDefaults.theme}`;
  return localizedThemeOptions.value.find((item) => item.value === value);
});

const activeTheme = computed<ActiveThemeState>(() => {
  const dark = darkMode.value;
  const value = `${state.value.theme || playgroundDefaults.theme}`;
  const colors = parseColorsValue(state.value.colors);

  return {
    value,
    dark,
    colors: colors.length
      ? colors
      : readThemeColors(themeOptions.value, value, dark),
  };
});

const activeDarkMode = computed(() => activeTheme.value.dark);

const activeAppearance = computed(() => ({
  dark: activeDarkMode.value,
  theme: state.value.colors ? '' : activeTheme.value.value,
  colors: state.value.colors ? `${state.value.colors}` : '',
  strokeWidth: state.value.strokeWidth,
  strokeColor: state.value.strokeColor,
  backgroundColor: state.value.backgroundColor,
}));

const requestUsername = computed(() => `${username.value || ''}`.trim());
const isMobile = computed(() => width.value < 768);

const themePreviewConfig = computed(() => ({
  chart: query.value.chart,
  weeks: state.value.weeks,
  widget_size: state.value.widget_size,
  dark: state.value.dark,
  gap: state.value.gap,
  scale: state.value.scale,
  light: state.value.light,
  gradient: state.value.gradient,
  legend: state.value.legend,
  legendPosition: state.value.legendPosition,
  legendDirection: state.value.legendDirection,
  foregroundColor: state.value.foregroundColor,
  strokeWidth: state.value.strokeWidth,
  strokeColor: state.value.strokeColor,
  backgroundColor: state.value.backgroundColor,
  flatten: state.value.flatten,
}));

const previewDataKey = computed(() => {
  const data = contributionData.value;
  if (!data) return 'mock';

  const weeks = Array.isArray(data.weeks) ? data.weeks : [];
  return stableSerialize({
    username: data.username,
    fetchedAt: data.fetchedAt,
    totalContributions: data.totalContributions,
    weeksCount: weeks.length,
    firstWeek: weeks[0]?.firstDay || '',
    lastWeek: weeks[weeks.length - 1]?.firstDay || '',
  });
});

const themePreviewKey = computed(() =>
  stableSerialize({
    config: themePreviewConfig.value,
    data: previewDataKey.value,
  }),
);

async function initConfig() {
  if (config.value?.length || loadingConfig.value) return;

  loadingConfig.value = true;
  try {
    config.value = await getConfig();
    applyDefaults(config.value);
    readThemeOptionList();
  } catch (error: any) {
    notifyError(error?.message || 'Failed to load config');
  } finally {
    loadingConfig.value = false;
  }
}

function clearFetchTimer() {
  if (!fetchTimer) return;
  clearTimeout(fetchTimer);
  fetchTimer = null;
}

function clearRenderTimer() {
  if (!renderTimer) return;
  clearTimeout(renderTimer);
  renderTimer = null;
}

function notifyError(message: string) {
  Notify.create({
    message,
    color: 'negative',
    position: 'top',
  });
}

function scheduleSvgRender(delay = CONFIG_RENDER_DEBOUNCE_MS) {
  clearRenderTimer();

  renderTimer = setTimeout(async () => {
    if (!requestUsername.value) {
      svgCode.value = '';
      return;
    }

    if (!contributionData.value) return;

    const sequence = ++renderSequence;
    renderingSvg.value = true;

    try {
      const svg = await renderContributionResponseSvg(
        contributionData.value,
        query.value,
      );
      if (sequence !== renderSequence) return;
      svgCode.value = svg;
    } catch (error: any) {
      if (sequence !== renderSequence) return;
      notifyError(error?.message || 'Failed to render SVG');
    } finally {
      if (sequence === renderSequence) {
        renderingSvg.value = false;
      }
    }
  }, delay);
}

function scheduleContributionsFetch(delay = USERNAME_RENDER_DEBOUNCE_MS) {
  clearFetchTimer();

  fetchTimer = setTimeout(async () => {
    const nextUsername = requestUsername.value;

    fetchController?.abort();
    fetchController = null;

    if (!nextUsername) {
      contributionData.value = null;
      svgCode.value = '';
      loadingContribution.value = false;
      return;
    }

    const controller = new AbortController();
    fetchController = controller;
    loadingContribution.value = true;

    try {
      const response = await getContributions(nextUsername, controller.signal);
      if (fetchController !== controller) return;
      contributionData.value = response;
      scheduleSvgRender(0);
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      if (fetchController !== controller) return;
      contributionData.value = null;
      notifyError(error?.message || 'Failed to load contributions');
    } finally {
      if (fetchController === controller) {
        loadingContribution.value = false;
        fetchController = null;
      }
    }
  }, delay);
}

function ensureInitialized() {
  if (initialized.value) return initPromise;

  initialized.value = true;
  initPromise = initConfig();

  watch(
    requestUsername,
    () => {
      scheduleContributionsFetch();
    },
    { immediate: true },
  );

  watch(
    query,
    () => {
      if (!contributionData.value) return;
      scheduleSvgRender();
    },
    { deep: true },
  );

  return initPromise;
}

watch(previewDataKey, () => {
  previewSvgCache.clear();
});

async function renderPreviewSvg(configLike: Record<string, any>) {
  const key = stableSerialize({
    data: previewDataKey.value,
    config: configLike,
  });
  const cached = previewSvgCache.get(key);
  if (cached) return cached;

  const task = (
    contributionData.value
      ? renderContributionResponseSvg(contributionData.value, configLike)
      : renderMockContributionSvg(configLike)
  ).catch((error) => {
    previewSvgCache.delete(key);
    throw error;
  });
  previewSvgCache.set(key, task);
  return task;
}

function renderThemePreview(theme: string) {
  if (theme === 'random') return Promise.resolve('');
  return renderPreviewSvg({
    ...themePreviewConfig.value,
    theme,
    colors: undefined,
  });
}

function usePreset(newState: Record<string, any>) {
  state.value = {
    ...playgroundDefaults,
    ...newState,
    dark: newState.dark ?? darkMode.value,
  };
}

export function useConfig() {
  ensureInitialized();

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
    configTabs,
    themeOptions,
    localizedThemeOptions,
    localeOptions,
    loadingConfig,
    selectedTheme,
    contributionData,
    previewDataKey,
    themePreviewConfig,
    themePreviewKey,

    renderPreviewSvg,
    renderThemePreview,
    usePreset,
  };
}
