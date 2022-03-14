export interface GithubUser {
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
  contributionCount: number;
  date: string;
  color?: string;
  weekday?: number;
}
