export interface Contribution {
  // username
  name: string;

  contributionsCollection: {
    contributionCalendar: {
      colors: string[];
      totalContributions: number;
      weeks: ContributionWeek[];
    };
  };
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
  firstDay: string;
}

export interface ContributionDay {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
}
