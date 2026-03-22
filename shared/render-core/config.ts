import {
  Bar3DAnimation,
  Bar3DLegendDirection,
  Bar3DLegendPosition,
  ChartTpl,
  WidgetSize,
} from './enums';

export interface BaseChartConfig {
  widget_size?: WidgetSize;
  quality?: number;
  dark?: boolean;
  tz?: string;
}

export interface CalendarChartConfig extends BaseChartConfig {
  colors?: string[];
  weeks?: number;
  tz?: string;
}

export interface CalendarChart3DConfig extends BaseChartConfig {
  scale?: number;
  gap?: number;
  colors?: string[];
  weeks?: number;
  light?: number;
  gradient?: boolean;
  legend?: boolean;
  legendPosition?: Bar3DLegendPosition;
  legendDirection?: Bar3DLegendDirection;
  foregroundColor?: string;
  strokeWidth?: number;
  strokeColor?: string;
  flatten?: number;
  animation?: Bar3DAnimation;
  animation_duration?: number;
  animation_delay?: number;
  animation_amplitude?: number;
  animation_frequency?: number;
  animation_wave_center?: Array<number>;
  animation_loop?: boolean;
  animation_reverse?: boolean;
}

export interface RenderContributionConfig extends CalendarChart3DConfig {
  chart?: ChartTpl;
  theme?: string;
}

export const defaultCalendarChartConfig: CalendarChartConfig = {
  widget_size: WidgetSize.MEDIUM,
  quality: 1,
  tz: 'Asia/Shanghai',
};

export const defaultCalenderChart3dConfig: CalendarChart3DConfig = {
  widget_size: WidgetSize.MEDIUM,
  quality: 1,
  scale: 2,
  gap: 1.2,
  light: 10,
  legend: false,
  legendPosition: Bar3DLegendPosition.RIGHT,
  legendDirection: Bar3DLegendDirection.COLUMN,
};
