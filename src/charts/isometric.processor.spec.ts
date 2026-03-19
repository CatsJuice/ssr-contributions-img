import { isometricProcessor } from './isometric.processor';
import { ContributionWeek } from '../types/contribution.interface';

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
});
