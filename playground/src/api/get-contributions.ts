import type { ContributionResponse } from '@render-core';

import { getApiPath } from '../utils/runtime-env';

export async function getContributions(
  username: string,
  signal?: AbortSignal,
): Promise<ContributionResponse> {
  const response = await fetch(
    getApiPath(`/contributions/${encodeURIComponent(username)}`),
    {
      method: 'GET',
      headers: {
        'X-Playground-Request': '1',
      },
      credentials: 'same-origin',
      signal,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return response.json();
}
