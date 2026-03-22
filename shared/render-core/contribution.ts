export interface GithubUser {
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

export interface ContributionResponse {
  username: string;
  weeks: ContributionWeek[];
  totalContributions: number;
  source: string;
  privateContributionsMode: string;
  privateContributionsReason: string;
  fetchedAt: string;
}
