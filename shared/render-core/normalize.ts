import {
  Bar3DAnimation,
  ChartTpl,
  WidgetSize,
  Bar3DLegendDirection,
  Bar3DLegendPosition,
} from './enums';
import {
  RenderContributionConfig,
  defaultCalendarChartConfig,
  defaultCalenderChart3dConfig,
} from './config';
import { getRandomTheme, getTheme } from './theme';

export type NormalizedRenderContributionConfig =
  RenderContributionConfig & {
    chart: ChartTpl;
    dark: boolean;
    theme: string;
    widget_size: WidgetSize;
    colors: string[];
    weeks: number;
    quality: number;
    tz: string;
    gap: number;
    scale: number;
    light: number;
    legend: boolean;
    legendPosition: Bar3DLegendPosition;
    legendDirection: Bar3DLegendDirection;
    gradient: boolean;
    flatten: number;
    animation?: Bar3DAnimation;
    animation_duration?: number;
    animation_delay?: number;
    animation_amplitude?: number;
    animation_frequency?: number;
    animation_wave_center: number[];
    animation_loop: boolean;
    animation_reverse: boolean;
    foregroundColor: string;
    strokeWidth?: number;
    strokeColor: string;
    backgroundColor: string;
  };

function normalizeColor(color: string) {
  const value = `${color || ''}`.trim().replace(/^#/, '');
  if (!value) return '';
  if (!/^(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    return `${color || ''}`.trim();
  }
  return `#${value}`;
}

function normalizeNumber(value: unknown) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizeInteger(value: unknown) {
  const numberValue = normalizeNumber(value);
  return numberValue === undefined ? undefined : parseInt(`${numberValue}`, 10);
}

function normalizeBoolean(value: unknown) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return undefined;
}

function normalizeColors(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeColor(`${item || ''}`)).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => normalizeColor(item))
      .filter(Boolean);
  }

  return [];
}

export function normalizeRenderConfig(
  input: RenderContributionConfig = {},
): NormalizedRenderContributionConfig {
  const chart = input.chart || ChartTpl.CALENDAR;
  const dark = normalizeBoolean(input.dark) ?? false;
  const theme = `${input.theme || 'green'}`;
  const widgetSize = `${input.widget_size || WidgetSize.MEDIUM}` as WidgetSize;
  const colors = normalizeColors(input.colors);
  const resolvedColors = colors.length
    ? colors
    : theme === 'random'
    ? getRandomTheme(dark)
    : getTheme(theme as any, dark);
  const defaultWeeks =
    {
      [WidgetSize.LARGE]: 40,
      [WidgetSize.MEDIUM]: 16,
      [WidgetSize.SMALL]: 7,
    }[widgetSize] || 16;

  return {
    ...defaultCalendarChartConfig,
    ...defaultCalenderChart3dConfig,
    ...input,
    chart,
    dark,
    theme,
    widget_size: widgetSize,
    colors: resolvedColors,
    weeks: normalizeInteger(input.weeks) || defaultWeeks,
    quality: normalizeNumber(input.quality) ?? 1,
    tz: input.tz || defaultCalendarChartConfig.tz || 'Asia/Shanghai',
    gap: normalizeNumber(input.gap) ?? defaultCalenderChart3dConfig.gap ?? 1.2,
    scale: normalizeNumber(input.scale) ?? defaultCalenderChart3dConfig.scale ?? 2,
    light: normalizeNumber(input.light) ?? defaultCalenderChart3dConfig.light ?? 10,
    legend:
      normalizeBoolean(input.legend) ??
      defaultCalenderChart3dConfig.legend ??
      false,
    legendPosition:
      input.legendPosition ?? defaultCalenderChart3dConfig.legendPosition!,
    legendDirection:
      input.legendDirection ?? defaultCalenderChart3dConfig.legendDirection!,
    gradient: normalizeBoolean(input.gradient) ?? false,
    flatten: normalizeInteger(input.flatten) ?? 0,
    animation: input.animation,
    animation_duration: normalizeNumber(input.animation_duration),
    animation_delay: normalizeNumber(input.animation_delay),
    animation_amplitude: normalizeNumber(input.animation_amplitude),
    animation_frequency: normalizeNumber(input.animation_frequency),
    animation_wave_center: Array.isArray(input.animation_wave_center)
      ? input.animation_wave_center.map((item) => normalizeNumber(item) || 0)
      : [],
    animation_loop: normalizeBoolean(input.animation_loop) ?? false,
    animation_reverse: normalizeBoolean(input.animation_reverse) ?? false,
    foregroundColor:
      typeof input.foregroundColor === 'string'
        ? normalizeColor(input.foregroundColor)
        : '',
    strokeWidth: normalizeNumber(input.strokeWidth),
    strokeColor:
      typeof input.strokeColor === 'string'
        ? normalizeColor(input.strokeColor)
        : '',
    backgroundColor:
      typeof input.backgroundColor === 'string'
        ? normalizeColor(input.backgroundColor)
        : '',
  };
}
