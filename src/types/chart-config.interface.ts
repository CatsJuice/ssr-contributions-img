import { WidgetSize } from 'src/dto/base/widget-size.dto';

export interface BaseChartConfig {
  widget_size?: WidgetSize;
  quality?: number;
}

export const defaultCalendarChartConfig: CalendarChartConfig = {
  widget_size: WidgetSize.MIDIUM,
  quality: 1,
  tz: 'Asia/Shanghai',
};
export interface CalendarChartConfig extends BaseChartConfig {
  colors?: string[];
  weeks?: number;
  tz?: string;
}

export const defaultCalenderChart3dConfig: CalendarChart3DConfig = {
  widget_size: WidgetSize.MIDIUM,
  quality: 1,
  scale: 2,
  gap: 1.2,
  light: 10,
};
export interface CalendarChart3DConfig extends BaseChartConfig {
  scale?: number;
  gap?: number;
  colors?: string[];
  weeks?: number;
  light?: number;
  gradient?: boolean;
}
