import { ContributionWeek } from './contribution';

export const MOCK_PREVIEW_WEEKS = 30;

// Snapshot of CatsJuice's last 30 contribution weeks, fetched on 2026-03-22.
export const MOCK_CONTRIBUTION_WEEKS: ContributionWeek[] = [
  {
    firstDay: '2025-08-31',
    contributionDays: [
      { date: '2025-08-31', contributionCount: 0, weekday: 0 },
      { date: '2025-09-01', contributionCount: 2, weekday: 1 },
      { date: '2025-09-02', contributionCount: 2, weekday: 2 },
      { date: '2025-09-03', contributionCount: 5, weekday: 3 },
      { date: '2025-09-04', contributionCount: 3, weekday: 4 },
      { date: '2025-09-05', contributionCount: 0, weekday: 5 },
      { date: '2025-09-06', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-09-07',
    contributionDays: [
      { date: '2025-09-07', contributionCount: 2, weekday: 0 },
      { date: '2025-09-08', contributionCount: 1, weekday: 1 },
      { date: '2025-09-09', contributionCount: 0, weekday: 2 },
      { date: '2025-09-10', contributionCount: 3, weekday: 3 },
      { date: '2025-09-11', contributionCount: 2, weekday: 4 },
      { date: '2025-09-12', contributionCount: 4, weekday: 5 },
      { date: '2025-09-13', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-09-14',
    contributionDays: [
      { date: '2025-09-14', contributionCount: 12, weekday: 0 },
      { date: '2025-09-15', contributionCount: 6, weekday: 1 },
      { date: '2025-09-16', contributionCount: 4, weekday: 2 },
      { date: '2025-09-17', contributionCount: 1, weekday: 3 },
      { date: '2025-09-18', contributionCount: 6, weekday: 4 },
      { date: '2025-09-19', contributionCount: 1, weekday: 5 },
      { date: '2025-09-20', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-09-21',
    contributionDays: [
      { date: '2025-09-21', contributionCount: 0, weekday: 0 },
      { date: '2025-09-22', contributionCount: 2, weekday: 1 },
      { date: '2025-09-23', contributionCount: 3, weekday: 2 },
      { date: '2025-09-24', contributionCount: 13, weekday: 3 },
      { date: '2025-09-25', contributionCount: 1, weekday: 4 },
      { date: '2025-09-26', contributionCount: 1, weekday: 5 },
      { date: '2025-09-27', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-09-28',
    contributionDays: [
      { date: '2025-09-28', contributionCount: 1, weekday: 0 },
      { date: '2025-09-29', contributionCount: 3, weekday: 1 },
      { date: '2025-09-30', contributionCount: 2, weekday: 2 },
      { date: '2025-10-01', contributionCount: 0, weekday: 3 },
      { date: '2025-10-02', contributionCount: 0, weekday: 4 },
      { date: '2025-10-03', contributionCount: 0, weekday: 5 },
      { date: '2025-10-04', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-10-05',
    contributionDays: [
      { date: '2025-10-05', contributionCount: 0, weekday: 0 },
      { date: '2025-10-06', contributionCount: 0, weekday: 1 },
      { date: '2025-10-07', contributionCount: 0, weekday: 2 },
      { date: '2025-10-08', contributionCount: 0, weekday: 3 },
      { date: '2025-10-09', contributionCount: 4, weekday: 4 },
      { date: '2025-10-10', contributionCount: 4, weekday: 5 },
      { date: '2025-10-11', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-10-12',
    contributionDays: [
      { date: '2025-10-12', contributionCount: 2, weekday: 0 },
      { date: '2025-10-13', contributionCount: 2, weekday: 1 },
      { date: '2025-10-14', contributionCount: 3, weekday: 2 },
      { date: '2025-10-15', contributionCount: 7, weekday: 3 },
      { date: '2025-10-16', contributionCount: 4, weekday: 4 },
      { date: '2025-10-17', contributionCount: 2, weekday: 5 },
      { date: '2025-10-18', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-10-19',
    contributionDays: [
      { date: '2025-10-19', contributionCount: 0, weekday: 0 },
      { date: '2025-10-20', contributionCount: 1, weekday: 1 },
      { date: '2025-10-21', contributionCount: 1, weekday: 2 },
      { date: '2025-10-22', contributionCount: 5, weekday: 3 },
      { date: '2025-10-23', contributionCount: 4, weekday: 4 },
      { date: '2025-10-24', contributionCount: 2, weekday: 5 },
      { date: '2025-10-25', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-10-26',
    contributionDays: [
      { date: '2025-10-26', contributionCount: 0, weekday: 0 },
      { date: '2025-10-27', contributionCount: 5, weekday: 1 },
      { date: '2025-10-28', contributionCount: 5, weekday: 2 },
      { date: '2025-10-29', contributionCount: 8, weekday: 3 },
      { date: '2025-10-30', contributionCount: 8, weekday: 4 },
      { date: '2025-10-31', contributionCount: 9, weekday: 5 },
      { date: '2025-11-01', contributionCount: 3, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-11-02',
    contributionDays: [
      { date: '2025-11-02', contributionCount: 3, weekday: 0 },
      { date: '2025-11-03', contributionCount: 6, weekday: 1 },
      { date: '2025-11-04', contributionCount: 7, weekday: 2 },
      { date: '2025-11-05', contributionCount: 4, weekday: 3 },
      { date: '2025-11-06', contributionCount: 9, weekday: 4 },
      { date: '2025-11-07', contributionCount: 13, weekday: 5 },
      { date: '2025-11-08', contributionCount: 4, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-11-09',
    contributionDays: [
      { date: '2025-11-09', contributionCount: 1, weekday: 0 },
      { date: '2025-11-10', contributionCount: 16, weekday: 1 },
      { date: '2025-11-11', contributionCount: 4, weekday: 2 },
      { date: '2025-11-12', contributionCount: 10, weekday: 3 },
      { date: '2025-11-13', contributionCount: 13, weekday: 4 },
      { date: '2025-11-14', contributionCount: 1, weekday: 5 },
      { date: '2025-11-15', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-11-16',
    contributionDays: [
      { date: '2025-11-16', contributionCount: 2, weekday: 0 },
      { date: '2025-11-17', contributionCount: 7, weekday: 1 },
      { date: '2025-11-18', contributionCount: 1, weekday: 2 },
      { date: '2025-11-19', contributionCount: 3, weekday: 3 },
      { date: '2025-11-20', contributionCount: 2, weekday: 4 },
      { date: '2025-11-21', contributionCount: 1, weekday: 5 },
      { date: '2025-11-22', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-11-23',
    contributionDays: [
      { date: '2025-11-23', contributionCount: 0, weekday: 0 },
      { date: '2025-11-24', contributionCount: 10, weekday: 1 },
      { date: '2025-11-25', contributionCount: 5, weekday: 2 },
      { date: '2025-11-26', contributionCount: 2, weekday: 3 },
      { date: '2025-11-27', contributionCount: 6, weekday: 4 },
      { date: '2025-11-28', contributionCount: 4, weekday: 5 },
      { date: '2025-11-29', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-11-30',
    contributionDays: [
      { date: '2025-11-30', contributionCount: 0, weekday: 0 },
      { date: '2025-12-01', contributionCount: 5, weekday: 1 },
      { date: '2025-12-02', contributionCount: 6, weekday: 2 },
      { date: '2025-12-03', contributionCount: 6, weekday: 3 },
      { date: '2025-12-04', contributionCount: 9, weekday: 4 },
      { date: '2025-12-05', contributionCount: 4, weekday: 5 },
      { date: '2025-12-06', contributionCount: 2, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-12-07',
    contributionDays: [
      { date: '2025-12-07', contributionCount: 1, weekday: 0 },
      { date: '2025-12-08', contributionCount: 14, weekday: 1 },
      { date: '2025-12-09', contributionCount: 6, weekday: 2 },
      { date: '2025-12-10', contributionCount: 9, weekday: 3 },
      { date: '2025-12-11', contributionCount: 5, weekday: 4 },
      { date: '2025-12-12', contributionCount: 3, weekday: 5 },
      { date: '2025-12-13', contributionCount: 2, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-12-14',
    contributionDays: [
      { date: '2025-12-14', contributionCount: 1, weekday: 0 },
      { date: '2025-12-15', contributionCount: 3, weekday: 1 },
      { date: '2025-12-16', contributionCount: 4, weekday: 2 },
      { date: '2025-12-17', contributionCount: 4, weekday: 3 },
      { date: '2025-12-18', contributionCount: 5, weekday: 4 },
      { date: '2025-12-19', contributionCount: 8, weekday: 5 },
      { date: '2025-12-20', contributionCount: 3, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-12-21',
    contributionDays: [
      { date: '2025-12-21', contributionCount: 4, weekday: 0 },
      { date: '2025-12-22', contributionCount: 11, weekday: 1 },
      { date: '2025-12-23', contributionCount: 24, weekday: 2 },
      { date: '2025-12-24', contributionCount: 0, weekday: 3 },
      { date: '2025-12-25', contributionCount: 1, weekday: 4 },
      { date: '2025-12-26', contributionCount: 6, weekday: 5 },
      { date: '2025-12-27', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2025-12-28',
    contributionDays: [
      { date: '2025-12-28', contributionCount: 2, weekday: 0 },
      { date: '2025-12-29', contributionCount: 13, weekday: 1 },
      { date: '2025-12-30', contributionCount: 10, weekday: 2 },
      { date: '2025-12-31', contributionCount: 10, weekday: 3 },
      { date: '2026-01-01', contributionCount: 0, weekday: 4 },
      { date: '2026-01-02', contributionCount: 0, weekday: 5 },
      { date: '2026-01-03', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-01-04',
    contributionDays: [
      { date: '2026-01-04', contributionCount: 0, weekday: 0 },
      { date: '2026-01-05', contributionCount: 5, weekday: 1 },
      { date: '2026-01-06', contributionCount: 10, weekday: 2 },
      { date: '2026-01-07', contributionCount: 12, weekday: 3 },
      { date: '2026-01-08', contributionCount: 6, weekday: 4 },
      { date: '2026-01-09', contributionCount: 21, weekday: 5 },
      { date: '2026-01-10', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-01-11',
    contributionDays: [
      { date: '2026-01-11', contributionCount: 1, weekday: 0 },
      { date: '2026-01-12', contributionCount: 15, weekday: 1 },
      { date: '2026-01-13', contributionCount: 23, weekday: 2 },
      { date: '2026-01-14', contributionCount: 11, weekday: 3 },
      { date: '2026-01-15', contributionCount: 30, weekday: 4 },
      { date: '2026-01-16', contributionCount: 28, weekday: 5 },
      { date: '2026-01-17', contributionCount: 2, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-01-18',
    contributionDays: [
      { date: '2026-01-18', contributionCount: 0, weekday: 0 },
      { date: '2026-01-19', contributionCount: 9, weekday: 1 },
      { date: '2026-01-20', contributionCount: 13, weekday: 2 },
      { date: '2026-01-21', contributionCount: 11, weekday: 3 },
      { date: '2026-01-22', contributionCount: 16, weekday: 4 },
      { date: '2026-01-23', contributionCount: 9, weekday: 5 },
      { date: '2026-01-24', contributionCount: 3, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-01-25',
    contributionDays: [
      { date: '2026-01-25', contributionCount: 2, weekday: 0 },
      { date: '2026-01-26', contributionCount: 3, weekday: 1 },
      { date: '2026-01-27', contributionCount: 12, weekday: 2 },
      { date: '2026-01-28', contributionCount: 10, weekday: 3 },
      { date: '2026-01-29', contributionCount: 9, weekday: 4 },
      { date: '2026-01-30', contributionCount: 6, weekday: 5 },
      { date: '2026-01-31', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-02-01',
    contributionDays: [
      { date: '2026-02-01', contributionCount: 0, weekday: 0 },
      { date: '2026-02-02', contributionCount: 9, weekday: 1 },
      { date: '2026-02-03', contributionCount: 9, weekday: 2 },
      { date: '2026-02-04', contributionCount: 7, weekday: 3 },
      { date: '2026-02-05', contributionCount: 6, weekday: 4 },
      { date: '2026-02-06', contributionCount: 2, weekday: 5 },
      { date: '2026-02-07', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-02-08',
    contributionDays: [
      { date: '2026-02-08', contributionCount: 4, weekday: 0 },
      { date: '2026-02-09', contributionCount: 2, weekday: 1 },
      { date: '2026-02-10', contributionCount: 3, weekday: 2 },
      { date: '2026-02-11', contributionCount: 7, weekday: 3 },
      { date: '2026-02-12', contributionCount: 6, weekday: 4 },
      { date: '2026-02-13', contributionCount: 0, weekday: 5 },
      { date: '2026-02-14', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-02-15',
    contributionDays: [
      { date: '2026-02-15', contributionCount: 0, weekday: 0 },
      { date: '2026-02-16', contributionCount: 0, weekday: 1 },
      { date: '2026-02-17', contributionCount: 0, weekday: 2 },
      { date: '2026-02-18', contributionCount: 0, weekday: 3 },
      { date: '2026-02-19', contributionCount: 0, weekday: 4 },
      { date: '2026-02-20', contributionCount: 0, weekday: 5 },
      { date: '2026-02-21', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-02-22',
    contributionDays: [
      { date: '2026-02-22', contributionCount: 0, weekday: 0 },
      { date: '2026-02-23', contributionCount: 0, weekday: 1 },
      { date: '2026-02-24', contributionCount: 1, weekday: 2 },
      { date: '2026-02-25', contributionCount: 2, weekday: 3 },
      { date: '2026-02-26', contributionCount: 5, weekday: 4 },
      { date: '2026-02-27', contributionCount: 10, weekday: 5 },
      { date: '2026-02-28', contributionCount: 6, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-03-01',
    contributionDays: [
      { date: '2026-03-01', contributionCount: 2, weekday: 0 },
      { date: '2026-03-02', contributionCount: 12, weekday: 1 },
      { date: '2026-03-03', contributionCount: 0, weekday: 2 },
      { date: '2026-03-04', contributionCount: 0, weekday: 3 },
      { date: '2026-03-05', contributionCount: 0, weekday: 4 },
      { date: '2026-03-06', contributionCount: 0, weekday: 5 },
      { date: '2026-03-07', contributionCount: 0, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-03-08',
    contributionDays: [
      { date: '2026-03-08', contributionCount: 0, weekday: 0 },
      { date: '2026-03-09', contributionCount: 0, weekday: 1 },
      { date: '2026-03-10', contributionCount: 2, weekday: 2 },
      { date: '2026-03-11', contributionCount: 5, weekday: 3 },
      { date: '2026-03-12', contributionCount: 6, weekday: 4 },
      { date: '2026-03-13', contributionCount: 1, weekday: 5 },
      { date: '2026-03-14', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-03-15',
    contributionDays: [
      { date: '2026-03-15', contributionCount: 7, weekday: 0 },
      { date: '2026-03-16', contributionCount: 16, weekday: 1 },
      { date: '2026-03-17', contributionCount: 8, weekday: 2 },
      { date: '2026-03-18', contributionCount: 6, weekday: 3 },
      { date: '2026-03-19', contributionCount: 19, weekday: 4 },
      { date: '2026-03-20', contributionCount: 11, weekday: 5 },
      { date: '2026-03-21', contributionCount: 1, weekday: 6 },
    ],
  },
  {
    firstDay: '2026-03-22',
    contributionDays: [{ date: '2026-03-22', contributionCount: 2, weekday: 0 }],
  },
];

export function getMockContributionWeeks(
  weeks = MOCK_PREVIEW_WEEKS,
): ContributionWeek[] {
  if (weeks <= 0) return [];

  return MOCK_CONTRIBUTION_WEEKS.slice(-Math.min(weeks, MOCK_CONTRIBUTION_WEEKS.length));
}
