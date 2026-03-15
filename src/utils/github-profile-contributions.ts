import { ContributionDay, ContributionWeek, GithubUser } from 'src/types/contribution.interface';

const PROFILE_WEEKS_WINDOW = 53;
const WINDOW_DAYS = 400;

function parseUtcDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map((value) => parseInt(value, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

function formatUtcDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(date: Date, days: number) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function getWeekStart(dateString: string) {
  const date = parseUtcDate(dateString);
  return formatUtcDate(addUtcDays(date, -date.getUTCDay()));
}

function getContributionCount(tooltipText: string) {
  const text = tooltipText.trim();
  if (!text || /^No contributions on /i.test(text)) return 0;
  const match = text.match(/^(\d+)\s+contributions?\s+on /i);
  return match ? parseInt(match[1], 10) : 0;
}

function getHtmlAttribute(attrs: string, name: string) {
  const match = attrs.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));
  return match ? match[1] : '';
}

function parseContributionDays(html: string) {
  const pattern = /<td\b([^>]*)><\/td>\s*<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/gi;
  const days: ContributionDay[] = [];

  let match: RegExpExecArray | null = pattern.exec(html);
  while (match) {
    const cellAttrs = match[1] || '';
    const tooltipAttrs = match[2] || '';
    const tooltipText = (match[3] || '').replace(/<[^>]+>/g, ' ').trim();

    if (!/ContributionCalendar-day/.test(cellAttrs)) {
      match = pattern.exec(html);
      continue;
    }

    const date = getHtmlAttribute(cellAttrs, 'data-date');
    const cellId = getHtmlAttribute(cellAttrs, 'id');
    const tooltipFor = getHtmlAttribute(tooltipAttrs, 'for');

    if (!date || (cellId && tooltipFor && cellId !== tooltipFor)) {
      match = pattern.exec(html);
      continue;
    }

    days.push({
      date,
      contributionCount: getContributionCount(tooltipText),
      weekday: parseUtcDate(date).getUTCDay(),
    });

    match = pattern.exec(html);
  }

  return days;
}

export function buildGithubUserFromContributionDays(
  username: string,
  contributionDays: ContributionDay[],
) {
  const weeksByStartDay = new Map<string, ContributionWeek>();

  contributionDays
    .sort((left, right) => left.date.localeCompare(right.date))
    .forEach((day) => {
      const firstDay = getWeekStart(day.date);
      const week = weeksByStartDay.get(firstDay) || {
        firstDay,
        contributionDays: [],
      };
      week.contributionDays.push(day);
      weeksByStartDay.set(firstDay, week);
    });

  const weeks = [...weeksByStartDay.values()]
    .sort((left, right) => left.firstDay.localeCompare(right.firstDay))
    .slice(-PROFILE_WEEKS_WINDOW);

  return {
    name: username,
    contributionsCollection: {
      contributionCalendar: {
        colors: [],
        totalContributions: contributionDays.reduce(
          (total, day) => total + day.contributionCount,
          0,
        ),
        weeks,
      },
    },
  } as GithubUser;
}

export function getContributionYearsForProfileWindow(today = new Date()) {
  const endDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()),
  );
  const startDate = addUtcDays(endDate, -WINDOW_DAYS);
  const years: number[] = [];

  for (
    let year = startDate.getUTCFullYear();
    year <= endDate.getUTCFullYear();
    year += 1
  ) {
    years.push(year);
  }

  return {
    years,
    startDate: formatUtcDate(startDate),
    endDate: formatUtcDate(endDate),
  };
}

export function mergeContributionDaysByDate(htmlList: string[], endDate: string, startDate: string) {
  const byDate = new Map<string, ContributionDay>();

  htmlList.forEach((html) => {
    parseContributionDays(html).forEach((day) => {
      if (day.date < startDate || day.date > endDate) return;
      byDate.set(day.date, day);
    });
  });

  return [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date));
}
