import { isometricProcessor } from './isometric.processor';
import { ContributionWeek } from '../types/contribution.interface';
import {
  Bar3DLegendDirection,
  Bar3DLegendPosition,
} from '../types/3dbar-legend.enum';

const contributionWeeks: ContributionWeek[] = [
  {
    firstDay: '2026-03-15',
    contributionDays: [
      { date: '2026-03-15', contributionCount: 0 },
      { date: '2026-03-16', contributionCount: 1 },
      { date: '2026-03-17', contributionCount: 2 },
      { date: '2026-03-18', contributionCount: 3 },
      { date: '2026-03-19', contributionCount: 4 },
      { date: '2026-03-20', contributionCount: 2 },
      { date: '2026-03-21', contributionCount: 1 },
    ],
  },
];

describe('isometricProcessor', () => {
  const baseConfig = {
    colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
    scale: 2,
    gap: 1.2,
    light: 10,
    weeks: 1,
  };

  const getDimension = (svg: string, attr: 'width' | 'height') => {
    const match = svg.match(new RegExp(`${attr}="([\\d.]+)"`));
    return match ? parseFloat(match[1]) : 0;
  };

  it('should render stroke width and stroke color when provided', () => {
    const svg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      strokeWidth: 1.5,
      strokeColor: '#111827',
    });

    expect(svg).toContain('stroke="#111827"');
    expect(svg).toContain('stroke-width="1.50"');
  });

  it('should default stroke width to 1 when only stroke color is provided', () => {
    const svg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      strokeColor: '#111827',
    });

    expect(svg).toContain('stroke="#111827"');
    expect(svg).toContain('stroke-width="1.00"');
  });

  it('should render a cube legend and expand the canvas when enabled', () => {
    const svgWithoutLegend = isometricProcessor(
      contributionWeeks,
      4,
      baseConfig,
    );
    const svgWithLegend = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.RIGHT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });

    expect(svgWithLegend).toContain('class="legend"');
    expect(svgWithLegend).toContain('class="legend-cube"');
    expect(svgWithLegend).toContain('class="legend-label"');
    expect(svgWithLegend).toContain('>0-0</text>');
    expect(svgWithLegend).toContain('>4-4</text>');
    expect(getDimension(svgWithLegend, 'width')).toBeGreaterThan(
      getDimension(svgWithoutLegend, 'width'),
    );
  });

  it('should use adaptive legend label colors by dark mode', () => {
    const lightSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      dark: false,
    });
    const darkSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      dark: true,
    });

    expect(lightSvg).toContain('class="legend-label"');
    expect(lightSvg).toContain('fill="#222"');
    expect(darkSvg).toContain('fill="#ddd"');
  });

  it('should allow overriding legend label color with foregroundColor', () => {
    const svg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      dark: true,
      foregroundColor: '#ff00aa',
    });

    expect(svg).toContain('fill="#ff00aa"');
  });

  it('should support row and column legend layouts', () => {
    const rowLegendSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.TOP,
      legendDirection: Bar3DLegendDirection.ROW,
    });
    const columnLegendSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.TOP,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });

    expect(getDimension(rowLegendSvg, 'width')).toBeGreaterThan(
      getDimension(columnLegendSvg, 'width'),
    );
    expect(getDimension(columnLegendSvg, 'height')).toBeGreaterThan(
      getDimension(rowLegendSvg, 'height'),
    );
    expect(rowLegendSvg).toContain('data-placement="below"');
    expect(columnLegendSvg).toContain('data-placement="right"');
  });

  it('should place vertical labels to the left when legend is on the right', () => {
    const svg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.RIGHT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });

    expect(svg).toContain('data-placement="left"');
  });

  it('should place topRight and bottomLeft legends without expanding the canvas', () => {
    const svgWithoutLegend = isometricProcessor(
      contributionWeeks,
      4,
      baseConfig,
    );
    const topRightSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.TOP_RIGHT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });
    const bottomLeftSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.BOTTOM_LEFT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });

    expect(getDimension(topRightSvg, 'width')).toBe(
      getDimension(svgWithoutLegend, 'width'),
    );
    expect(getDimension(topRightSvg, 'height')).toBe(
      getDimension(svgWithoutLegend, 'height'),
    );
    expect(getDimension(bottomLeftSvg, 'width')).toBe(
      getDimension(svgWithoutLegend, 'width'),
    );
    expect(getDimension(bottomLeftSvg, 'height')).toBe(
      getDimension(svgWithoutLegend, 'height'),
    );
    expect(topRightSvg).toContain('data-position="topRight"');
    expect(bottomLeftSvg).toContain('data-position="bottomLeft"');
  });

  it('should adapt vertical label alignment for topRight and bottomLeft legend corners', () => {
    const topRightSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.TOP_RIGHT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });
    const bottomLeftSvg = isometricProcessor(contributionWeeks, 4, {
      ...baseConfig,
      legend: true,
      legendPosition: Bar3DLegendPosition.BOTTOM_LEFT,
      legendDirection: Bar3DLegendDirection.COLUMN,
    });

    expect(topRightSvg).toContain('data-placement="left"');
    expect(bottomLeftSvg).toContain('data-placement="right"');
  });
});
