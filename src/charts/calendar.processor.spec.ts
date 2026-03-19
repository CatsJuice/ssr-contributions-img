import { calendarProcessor } from './calendar.processor';
import { WidgetSize } from '../dto/base/widget-size.dto';
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

describe('calendarProcessor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should format the range end date with the configured time zone', () => {
    jest.setSystemTime(new Date('2026-03-19T23:30:00.000Z'));

    const option = calendarProcessor(contributionWeeks, 4, {
      colors: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      weeks: 1,
      tz: 'Asia/Shanghai',
      widget_size: WidgetSize.MEDIUM,
    });

    expect(option.calendar[0].range).toEqual(['2026-03-15', '2026-03-20']);
  });
});
