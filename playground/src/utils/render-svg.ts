import type {
  ContributionResponse,
  GithubUser,
  RenderContributionConfig,
} from '@render-core';
import {
  renderContributionSvg,
  renderThemePreviewSvg,
} from '@render-core';

export function buildGithubUserFromContributionResponse(
  response: ContributionResponse,
): GithubUser {
  return {
    name: response.username,
    contributionsCollection: {
      contributionCalendar: {
        colors: [],
        totalContributions: response.totalContributions,
        weeks: response.weeks,
      },
    },
  };
}

export async function renderContributionResponseSvg(
  response: ContributionResponse,
  config: Record<string, any> = {},
) {
  return renderContributionSvg(
    buildGithubUserFromContributionResponse(response),
    config as RenderContributionConfig,
  );
}

export async function renderMockContributionSvg(config: Record<string, any> = {}) {
  return renderThemePreviewSvg(config as RenderContributionConfig);
}
