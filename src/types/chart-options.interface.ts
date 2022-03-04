export interface BaseChartOptions {
  widgetSize?: 'small' | 'midium' | 'large';
}

export const defaultCalendarChartOptions: CalendarChartOptions = {
  widgetSize: 'midium',
  colors: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196027'],
};
export interface CalendarChartOptions extends BaseChartOptions {
  colors?: string[];
}
