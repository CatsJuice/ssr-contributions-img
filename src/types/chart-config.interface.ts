import { WidgetSize } from 'src/dto/config-chart.query.dto';

export interface BaseChartConfig {
  widgetSize?: WidgetSize;
  quality?: number;
}

export const defaultCalendarChartConfig: CalendarChartConfig = {
  widgetSize: WidgetSize.MIDIUM,
  quality: 1,
};
export interface CalendarChartConfig extends BaseChartConfig {
  colors?: string[];
  weeks?: number;
}
