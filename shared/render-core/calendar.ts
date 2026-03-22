import { WidgetSize } from './enums';
import { CalendarChartConfig } from './config';
import { ContributionWeek } from './contribution';

type EChartsCore = {
  use: (modules: unknown[]) => void;
  init: (
    dom: unknown,
    theme: unknown,
    opts: {
      renderer: 'svg';
      ssr: boolean;
      width: number;
      height: number;
    },
  ) => {
    setOption: (option: unknown) => void;
    renderToSVGString: () => string;
    dispose: () => void;
  };
};

let echartsPromise: Promise<EChartsCore> | null = null;

function formatCurrentDate(timeZone?: string) {
  try {
    const parts = new Intl.DateTimeFormat('en', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value;

    return `${get('year')}-${get('month')}-${get('day')}`;
  } catch {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

export function calendarProcessor(
  contributionWeeks: ContributionWeek[],
  max: number,
  cfg: CalendarChartConfig = {},
) {
  const weekCount = cfg.weeks || contributionWeeks.length;
  const seriesData: Array<[string, number]> = [];
  contributionWeeks.forEach((week) => {
    week.contributionDays.forEach((day) => {
      seriesData.push([day.date, day.contributionCount]);
    });
  });

  return {
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
          formatCurrentDate(cfg.tz),
        ],
      },
    ],
    visualMap: {
      type: 'piecewise',
      min: 0,
      max,
      inRange: { color: (cfg.colors || []).slice(1) },
      show: false,
    },
    series: [
      {
        type: 'custom',
        coordinateSystem: 'calendar',
        renderItem: function (params: any, api: any) {
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
              fill: value ? api.visual('color') : cfg.colors?.[0],
            },
          };
        },
        dimensions: [undefined, { type: 'ordinal' }],
        data: seriesData,
      },
    ],
    backgroundColor: 'transparent',
  };
}

async function loadEChartsCore() {
  if (!echartsPromise) {
    echartsPromise = Promise.all([
      import('echarts/core'),
      import('echarts/charts'),
      import('echarts/components'),
      import('echarts/renderers'),
    ]).then(([core, charts, components, renderers]) => {
      core.use([
        charts.CustomChart,
        components.CalendarComponent,
        components.VisualMapComponent,
        renderers.SVGRenderer,
      ]);
      return core as unknown as EChartsCore;
    });
  }

  return echartsPromise;
}

export async function renderCalendarSvg(
  contributionWeeks: ContributionWeek[],
  max: number,
  cfg: CalendarChartConfig = {},
) {
  const weekCount = cfg.weeks || contributionWeeks.length;
  const width = weekCount * 20 + (weekCount - 1) * 4 + 40;
  const height =
    cfg.widget_size === WidgetSize.LARGE ? 20 * 18 + 17 * 4 + 40 : 20 * 7 + 6 * 4 + 40;
  const echarts = await loadEChartsCore();
  const chart = echarts.init(null, null, {
    renderer: 'svg',
    ssr: true,
    width,
    height,
  });

  chart.setOption(calendarProcessor(contributionWeeks, max, cfg));
  const svg = chart.renderToSVGString();
  chart.dispose();

  return svg
    .replace('<svg ', '<svg preserveAspectRatio="xMidYMid meet" ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');
}
