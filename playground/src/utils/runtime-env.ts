import { validatePath } from '../components/utils/validatePath';

const DEFAULT_GITHUB_REPO_URL =
  'https://github.com/CatsJuice/ssr-contributions-img';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : '/');
}

export function getApiPath(path: string) {
  return validatePath(`${getApiBaseUrl()}/${path.replace(/^\/+/, '')}`);
}

export function getGithubRepoUrl() {
  return import.meta.env.VITE_GITHUB_REPO_URL || DEFAULT_GITHUB_REPO_URL;
}
