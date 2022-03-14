import * as moment from 'moment';
import { WidgetSize } from 'src/dto/base/widget-size.dto';
import { CalendarChartConfig } from 'src/types/chart-config.interface';

import { ContributionWeek } from 'src/types/contribution.interface';

export const calendarProcessor = (
  contributionWeeks: ContributionWeek[],
  max: number,
  cfg: CalendarChartConfig = {},
) => {
  const weekCount = cfg.weeks;

  const seriesData = contributionWeeks.reduce(
    (res, week) => [
      ...res,
      ...week.contributionDays.map((day) => [day.date, day.contributionCount]),
    ],
    [],
  );

  const opt = {
    calendar: [
      {
        color: 'transparent',
        ...(cfg.widget_size === WidgetSize.LARGE
          ? {
              width: 20 * weekCount + (weekCount - 1) * 4,
              height: 20 * 7 + 6 * 4,
              left: 'center',
              top: 'middle',
            }
          : {
              left: 20,
              right: 20,
              top: 20,
              bottom: 20,
            }),
        cellSize: [20, 20],
        itemStyle: { borderColor: 'transparent', opacity: 0 },
        splitLine: { show: false },
        yearLabel: { show: false },
        dayLabel: { show: false },
        monthLabel: { show: false },
        range: [
          contributionWeeks[contributionWeeks.length - 1].firstDay,
          moment().format('YYYY-MM-DD'),
        ],
      },
    ],
    visualMap: {
      type: 'piecewise',
      min: 0,
      max,
      inRange: { color: cfg.colors.slice(1) },
      show: false,
    },
    series: [
      {
        type: 'custom',
        coordinateSystem: 'calendar',
        renderItem: function (params, api) {
          const cellPoint = api.coord(api.value(0));
          const cellWidth = params.coordSys.cellWidth;
          const cellHeight = params.coordSys.cellHeight;
          const value = api.value(1);
          if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) return;
          return {
            z2: 100,
            type: 'rect',
            shape: {
              x: -cellWidth / 2 + 2,
              y: -cellHeight / 2 + 2,
              width: cellWidth - 4,
              height: cellHeight - 4,
              r: 4,
            },
            position: cellPoint,
            style: {
              fill: value ? api.visual('color') : cfg.colors[0],
            },
          };
        },
        dimensions: [undefined, { type: 'ordinal' }],
        data: seriesData,
      },
    ],
    backgroundColor: 'transparent',
  };
  return opt;
};
