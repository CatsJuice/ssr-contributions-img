import { CalendarChartOptions } from 'src/types/chart-options.interface';
import {
  Contribution,
  ContributionDay,
  ContributionWeek,
} from 'src/types/contribution.interface';
import * as moment from 'moment';

export const calendarProcessor = (
  data: Contribution,
  opts: CalendarChartOptions = {},
) => {
  const weekCount =
    {
      small: 7,
      midium: 16,
      large: 32,
    }[opts.widgetSize] || 7;
  const slicedData = data.contributionsCollection.contributionCalendar.weeks
    .sort(
      (w1, w2) =>
        new Date(w2.firstDay).getTime() - new Date(w1.firstDay).getTime(),
    )
    .slice(0, weekCount);
  const max = slicedData.reduce((prev: number, curr: ContributionWeek) => {
    return Math.max(
      prev,
      curr.contributionDays.reduce((_prev: number, _curr: ContributionDay) => {
        return Math.max(_prev, _curr.contributionCount);
      }, 0),
    );
  }, 0);

  const seriesData = slicedData.reduce(
    (res, week) => [
      ...res,
      ...week.contributionDays.map((day) => [day.date, day.contributionCount]),
    ],
    [],
  );

  const opt = {
    calendar: [
      {
        left: 'center',
        top: 'middle',
        cellSize: [20, 20],
        itemStyle: { borderColor: 'transparent' },
        splitLine: { show: false },
        yearLabel: { show: false },
        dayLabel: { show: false },
        monthLabel: { show: false },
        range: [
          slicedData[slicedData.length - 1].firstDay,
          moment().format('YYYY-MM-DD'),
        ],
      },
    ],
    visualMap: {
      type: 'piecewise',
      min: 0,
      max,
      inRange: { color: opts.colors.slice(1) },
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
              fill: value ? api.visual('color') : opts.colors[0],
            },
          };
        },
        dimensions: [undefined, { type: 'ordinal' }],
        data: seriesData,
      },
    ],
  };
  return opt;
};
