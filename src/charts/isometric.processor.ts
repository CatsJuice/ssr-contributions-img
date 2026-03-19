import { CalendarChart3DConfig } from '../types/chart-config.interface';
import {
  Bar3DLegendDirection,
  Bar3DLegendPosition,
} from '../types/3dbar-legend.enum';
import { generate3dbarAnimation } from './animations/3dbar-animator';
import {
  ContributionDay,
  ContributionWeek,
} from '../types/contribution.interface';

interface CubeMarkupOptions {
  color: string;
  height: number;
  level: number;
  className: string;
  ox: number;
  oy: number;
  sizeX: number;
  sizeY: number;
  data?: Record<string, number | string>;
}

type LegendLabelPlacement = 'below' | 'left' | 'right';

function d(pathArr: number[][]) {
  return `M${pathArr.map((p) => `${fix(p[0])},${fix(p[1])}`).join(' ')} z`;
}

function el(
  name: string,
  options: Record<string, any> = {},
  children: string[] = [],
): string {
  return `<${name} ${Object.entries(options)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')}>${children.join('')}</${name}>`;
}

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt('' + (R * (100 + percent)) / 100);
  G = parseInt('' + (G * (100 + percent)) / 100);
  B = parseInt('' + (B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

  return '#' + RR + GG + BB;
}

function fix(num: number, len = 2) {
  return num.toFixed(len);
}

export const isometricProcessor = (
  contributionWeeks: ContributionWeek[],
  max: number,
  cfg: CalendarChart3DConfig = {},
) => {
  const palette = cfg.colors?.length ? cfg.colors : ['#ebedf0'];
  const scale = cfg.scale || 2;
  const gap = cfg.gap ?? 1.2;
  const light = cfg.light ?? 10;
  const gradient = !!cfg.gradient;
  const legendEnabled = !!cfg.legend;
  const legendPosition = cfg.legendPosition || Bar3DLegendPosition.RIGHT;
  const legendDirection = cfg.legendDirection || Bar3DLegendDirection.COLUMN;
  const foregroundColor = cfg.foregroundColor || (cfg.dark ? '#ddd' : '#222');
  const legendOnRight = [
    Bar3DLegendPosition.RIGHT,
    Bar3DLegendPosition.TOP_RIGHT,
  ].includes(legendPosition);
  const legendOverlayPosition = [
    Bar3DLegendPosition.TOP_RIGHT,
    Bar3DLegendPosition.BOTTOM_LEFT,
  ].includes(legendPosition);
  const weekCount = contributionWeeks.length;
  const strokeWidth =
    cfg.strokeWidth !== undefined || cfg.strokeColor
      ? Math.max(cfg.strokeWidth ?? 1, 0)
      : 0;

  const maxHeight = 80;
  const minHeight = 3.2;
  const sizeX = 16;
  const sizeY = sizeX / scale;
  const stepX = sizeX + gap;
  const stepY = sizeY + gap;
  const rowNum = 7;
  const colNum = contributionWeeks.length;
  const chartWidth = stepX * (colNum + rowNum);
  const chartHeight = stepY * (colNum + rowNum) + maxHeight;
  const chartTranslateX = rowNum * stepX;
  const chartTranslateY = maxHeight;

  const shadeColorLeft = (color: string) => shadeColor(color, -(15 + light));
  const shadeColorRight = (color: string) => shadeColor(color, -(5 + light));
  const shadeColorTop = (color: string) => shadeColor(color, -10 + light);

  const gradientArr = gradient
    ? palette.slice(1).map((color, index) => {
        const subColors = palette.slice(1, 1 + index + 1).reverse();
        const sides = ['left', 'right'];
        return sides
          .map((side) => {
            return `<linearGradient id="gradient_${side}_${index}" gradientTransform="rotate(90)">
                <stop offset="0%" stop-color="${
                  side === 'left'
                    ? shadeColorLeft(subColors[0])
                    : shadeColorRight(subColors[0])
                }" />
                <stop offset="100%" stop-color="${
                  side === 'left'
                    ? shadeColorLeft(subColors[1] || subColors[0])
                    : shadeColorRight(subColors[1] || subColors[0])
                }" />
              </linearGradient>`;
          })
          .join('\n');
      })
    : [];

  const coord = (day: ContributionDay) => {
    const ratio = max > 0 ? day.contributionCount / max : 0;
    const level = Math.ceil(ratio * (palette.length - 1));
    const color = palette[Math.max(0, Math.min(level, palette.length - 1))];
    const rawHeight = Math.ceil(ratio * maxHeight);
    let height = rawHeight ? rawHeight + minHeight : minHeight;
    if (cfg.flatten) {
      height =
        cfg.flatten === 2 ? (minHeight === height ? minHeight : sizeX) : sizeX;
    }
    return { level, color, height };
  };

  const cubeBuilder = ({
    color,
    height,
    level,
    className,
    ox,
    oy,
    sizeX,
    sizeY,
    data = {},
  }: CubeMarkupOptions) => {
    const pA = [ox - sizeX, oy + sizeY];
    const pB = [ox, oy + 2 * sizeY];
    const pC = [ox + sizeX, oy + sizeY];
    const pD = [ox - sizeX, oy - height + sizeY];
    const pE = [ox, oy - height + 2 * sizeY];
    const pF = [ox + sizeX, oy - height + sizeY];
    const pG = [ox, oy - height];

    const faceLeft = [pE, pD, pA, pB];
    const faceRight = [pE, pF, pC, pB];
    const faceTop = [pE, pD, pG, pF];

    const gradientMode = gradient && level > 1;
    const fillTop = shadeColorTop(color);
    const fillLeft = gradientMode
      ? `url(#gradient_left_${level - 1})`
      : shadeColorLeft(color);
    const fillRight = gradientMode
      ? `url(#gradient_right_${level - 1})`
      : shadeColorRight(color);
    const stroke =
      strokeWidth > 0
        ? {
            stroke: cfg.strokeColor || shadeColor(color, -(25 + light)),
            'stroke-width': fix(strokeWidth),
            'stroke-linejoin': 'round',
          }
        : {};
    const attrs = Object.entries(data).reduce(
      (res, [key, value]) => ({
        ...res,
        [`data-${key}`]: value,
      }),
      { class: className } as Record<string, number | string>,
    );
    const paths = [
      { d: d(faceLeft), fill: fillLeft, ...stroke },
      { d: d(faceRight), fill: fillRight, ...stroke },
      { d: d(faceTop), fill: fillTop, ...stroke },
    ].map((g) => el('path', g));
    return el('g', attrs, paths);
  };

  const coordIndex = (rowIndex: number, colIndex: number) => [
    (rowIndex - colIndex) * stepX,
    (rowIndex + colIndex) * stepY,
  ];

  const dayBuilder = (
    contributionDay: ContributionDay,
    weekIndex: number,
    dayIndex: number,
  ) => {
    const [ox, oy] = coordIndex(weekIndex, dayIndex);
    const { level, color, height } = coord(contributionDay);
    return cubeBuilder({
      ox,
      oy,
      color,
      height,
      level,
      sizeX,
      sizeY,
      className: 'day',
      data: {
        week: weekIndex,
        day: dayIndex,
        level,
      },
    });
  };

  const weekBuilder = (contributionWeek: ContributionWeek, weekIndex: number) =>
    contributionWeek.contributionDays
      .map((day, dayIndex) => dayBuilder(day, weekIndex, dayIndex))
      .join('\n');

  const legendCubeSizeX = sizeX * 0.72;
  const legendCubeSizeY = legendCubeSizeX / scale;
  const legendHeightStep = Math.max(3, legendCubeSizeX * 0.35);
  const legendFontSize = 9;
  const legendLabelGap = 6;
  const legendTextHeight = legendFontSize + 3;
  const legendHeights = palette.map(
    (_, index) => minHeight + index * legendHeightStep,
  );
  const legendMaxCubeHeight =
    legendHeights[legendHeights.length - 1] || minHeight;
  const legendCubeSpanWidth = legendCubeSizeX * 2;
  const legendCubeSpanHeight = legendMaxCubeHeight + legendCubeSizeY * 2;
  const legendPadding = 4;
  const legendSpacing = Math.max(8, gap * 4);
  const legendLabelPlacement: LegendLabelPlacement =
    legendDirection === Bar3DLegendDirection.ROW
      ? 'below'
      : legendOnRight
      ? 'left'
      : 'right';
  const legendRangeLabel = (level: number) => {
    if (max <= 0) return '0-0';
    if (level === 0) return '0-0';
    const stepCount = Math.max(palette.length - 1, 1);
    const from = Math.floor(((level - 1) * max) / stepCount) + 1;
    const to =
      level === stepCount
        ? max
        : Math.max(from, Math.floor((level * max) / stepCount));
    return `${from}-${to}`;
  };
  const estimateTextWidth = (text: string) =>
    Math.max(text.length * legendFontSize * 0.62, legendFontSize * 2.4);
  const legendLabels = palette.map((_, index) => legendRangeLabel(index));
  const legendLabelWidths = legendLabels.map(estimateTextWidth);
  const legendLabelMaxWidth = Math.max(...legendLabelWidths, 0);
  const legendSideTextWidth =
    legendLabelPlacement === 'below' ? 0 : legendLabelMaxWidth;
  const legendBelowTextWidth =
    legendLabelPlacement === 'below' ? legendLabelMaxWidth : 0;
  const legendCellWidth =
    Math.max(legendCubeSpanWidth, legendBelowTextWidth) +
    (legendLabelPlacement === 'below'
      ? legendSpacing
      : legendSideTextWidth + legendLabelGap + legendSpacing);
  const legendCellHeight =
    Math.max(legendCubeSpanHeight, legendTextHeight) +
    (legendLabelPlacement === 'below'
      ? legendTextHeight + legendLabelGap + legendSpacing
      : legendSpacing);
  const legendWidth = legendEnabled
    ? legendPadding * 2 +
      (legendDirection === Bar3DLegendDirection.ROW
        ? legendCellWidth * palette.length
        : legendCellWidth)
    : 0;
  const legendHeight = legendEnabled
    ? legendPadding * 2 +
      (legendDirection === Bar3DLegendDirection.COLUMN
        ? legendCellHeight * palette.length
        : legendCellHeight)
    : 0;

  const legendMarkup = legendEnabled
    ? palette
        .map((color, index) => {
          const label = legendLabels[index];
          const cellX =
            legendPadding +
            (legendDirection === Bar3DLegendDirection.ROW
              ? index * legendCellWidth
              : 0);
          const cellY =
            legendPadding +
            (legendDirection === Bar3DLegendDirection.COLUMN
              ? index * legendCellHeight
              : 0);
          const cubeOffsetX =
            legendLabelPlacement === 'left'
              ? legendSideTextWidth + legendLabelGap + legendCubeSizeX
              : legendLabelPlacement === 'right'
              ? legendCubeSizeX
              : legendCellWidth / 2 - legendSpacing / 2;
          const cubeOffsetY = legendMaxCubeHeight;
          const cubeHeight = legendHeights[index];
          const cubeMarkup = cubeBuilder({
            ox: cubeOffsetX,
            oy: cubeOffsetY,
            color,
            height: cubeHeight,
            level: index,
            sizeX: legendCubeSizeX,
            sizeY: legendCubeSizeY,
            className: 'legend-cube',
            data: {
              legend: index,
              level: index,
              range: label,
            },
          });
          const cubeCenterY =
            (cubeOffsetY - cubeHeight + cubeOffsetY + legendCubeSizeY * 2) / 2;
          const labelMarkup = el(
            'text',
            legendLabelPlacement === 'below'
              ? {
                  class: 'legend-label',
                  'data-placement': legendLabelPlacement,
                  'data-range': label,
                  x: fix(legendCellWidth / 2 - legendSpacing / 2),
                  y: fix(legendCubeSpanHeight + legendLabelGap),
                  fill: foregroundColor,
                  'font-size': fix(legendFontSize, 0),
                  'text-anchor': 'middle',
                  'dominant-baseline': 'hanging',
                }
              : {
                  class: 'legend-label',
                  'data-placement': legendLabelPlacement,
                  'data-range': label,
                  x:
                    legendLabelPlacement === 'left'
                      ? fix(legendSideTextWidth)
                      : fix(legendCubeSpanWidth + legendLabelGap),
                  y: fix(cubeCenterY),
                  fill: foregroundColor,
                  'font-size': fix(legendFontSize, 0),
                  'text-anchor':
                    legendLabelPlacement === 'left' ? 'end' : 'start',
                  'dominant-baseline': 'middle',
                },
            [label],
          );

          return el(
            'g',
            {
              class: 'legend-item',
              'data-legend': index,
              'data-range': label,
              transform: `translate(${fix(cellX)},${fix(cellY)})`,
            },
            [cubeMarkup, labelMarkup],
          );
        })
        .join('\n')
    : '';

  const legendGap = legendEnabled ? 12 : 0;
  let svgWidth = chartWidth;
  let svgHeight = chartHeight;
  let chartOffsetX = 0;
  let chartOffsetY = 0;
  let legendX = 0;
  let legendY = 0;

  if (legendEnabled) {
    if (legendOverlayPosition) {
      svgWidth = chartWidth;
      svgHeight = chartHeight;
      chartOffsetX = 0;
      chartOffsetY = 0;
      legendX =
        legendPosition === Bar3DLegendPosition.TOP_RIGHT
          ? Math.max(svgWidth - legendWidth, 0)
          : 0;
      legendY =
        legendPosition === Bar3DLegendPosition.BOTTOM_LEFT
          ? Math.max(svgHeight - legendHeight, 0)
          : 0;
    } else if (
      legendPosition === Bar3DLegendPosition.LEFT ||
      legendPosition === Bar3DLegendPosition.RIGHT
    ) {
      svgWidth = chartWidth + legendWidth + legendGap;
      svgHeight = Math.max(chartHeight, legendHeight);
      chartOffsetX =
        legendPosition === Bar3DLegendPosition.LEFT
          ? legendWidth + legendGap
          : 0;
      chartOffsetY = Math.max((svgHeight - chartHeight) / 2, 0);
      legendX =
        legendPosition === Bar3DLegendPosition.LEFT
          ? 0
          : chartWidth + legendGap;
      legendY = Math.max((svgHeight - legendHeight) / 2, 0);
    } else {
      svgWidth = Math.max(chartWidth, legendWidth);
      svgHeight = chartHeight + legendHeight + legendGap;
      chartOffsetX = Math.max((svgWidth - chartWidth) / 2, 0);
      chartOffsetY =
        legendPosition === Bar3DLegendPosition.TOP
          ? legendHeight + legendGap
          : 0;
      legendX = Math.max((svgWidth - legendWidth) / 2, 0);
      legendY =
        legendPosition === Bar3DLegendPosition.TOP
          ? 0
          : chartHeight + legendGap;
    }
  }

  const animation = generate3dbarAnimation(weekCount, cfg, {
    width: svgWidth,
    height: svgHeight,
  });

  return `
    <svg 
      version='1.1' 
      xmlns='http://www.w3.org/2000/svg' 
      xmlns:xlink='http://www.w3.org/1999/xlink' 
      x='0px' 
      y='0px'
      width="${fix(svgWidth)}"
      height="${fix(svgHeight)}"
      viewBox='0 0 ${fix(svgWidth)} ${fix(svgHeight)}' 
      xml:space='preserve'
    >
      <style>${animation}</style>
      <defs>
        ${gradient ? gradientArr.join('\n') : ''}
      </defs>
      <g
        class="chart"
        transform="translate(${fix(chartOffsetX + chartTranslateX)},${fix(
    chartOffsetY + chartTranslateY,
  )})"
      >
        ${[...contributionWeeks]
          .reverse()
          .map((week, index) => weekBuilder(week, index))
          .join('\n')}
      </g>
      ${
        legendEnabled
          ? `<g class="legend" data-position="${legendPosition}" transform="translate(${fix(
              legendX,
            )},${fix(legendY)})">
        ${legendMarkup}
      </g>`
          : ''
      }
    </svg>
  `
    .trim()
    .replace(/[\n|\r]+/g, '\n');
};
