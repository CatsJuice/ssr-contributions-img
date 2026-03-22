import {
  CalendarChart3DConfig,
  RenderContributionConfig,
} from './config';
import { ContributionWeek, GithubUser } from './contribution';
import { ChartTpl } from './enums';
import { MOCK_PREVIEW_WEEKS, getMockContributionWeeks } from './mock-data';
import { normalizeRenderConfig } from './normalize';
import { renderCalendarSvg } from './calendar';
import { isometricProcessor } from './isometric';

function maxInArray(values: number[]) {
  return values.reduce(
    (currentMax, value) =>
      Number.isFinite(value) ? Math.max(currentMax, value) : currentMax,
    0,
  );
}

function buildUserFromWeeks(weeks: ContributionWeek[]): GithubUser {
  const totalContributions = weeks.reduce(
    (total, week) =>
      total +
      week.contributionDays.reduce(
        (weekTotal, day) => weekTotal + day.contributionCount,
        0,
      ),
    0,
  );

  return {
    name: 'mock',
    contributionsCollection: {
      contributionCalendar: {
        colors: [],
        totalContributions,
        weeks,
      },
    },
  };
}

function sliceWeeks(weeks: ContributionWeek[], targetWeeks: number) {
  return [...weeks]
    .sort(
      (left, right) =>
        new Date(right.firstDay).getTime() - new Date(left.firstDay).getTime(),
    )
    .slice(0, targetWeeks);
}

export async function renderContributionSvg(
  user: GithubUser,
  input: RenderContributionConfig = {},
) {
  const config = normalizeRenderConfig(input);
  const contributionWeeks = sliceWeeks(
    user.contributionsCollection.contributionCalendar.weeks,
    config.weeks,
  );
  const max = maxInArray(
    contributionWeeks.map((week) =>
      maxInArray(week.contributionDays.map((day) => day.contributionCount)),
    ),
  );

  if (config.chart === ChartTpl.CALENDAR) {
    return renderCalendarSvg(contributionWeeks, max, config);
  }

  return isometricProcessor(
    contributionWeeks,
    max,
    config as CalendarChart3DConfig,
  )
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');
}

export async function renderThemePreviewSvg(input: RenderContributionConfig = {}) {
  const mockConfig = normalizeRenderConfig({
    ...input,
    weeks: MOCK_PREVIEW_WEEKS,
    quality: 1,
  });

  return renderContributionSvg(
    buildUserFromWeeks(getMockContributionWeeks(MOCK_PREVIEW_WEEKS)),
    {
      ...mockConfig,
      weeks: MOCK_PREVIEW_WEEKS,
    },
  );
}
