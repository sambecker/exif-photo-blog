import { VERCEL_IS_PROVIDER_GITHUB } from '@/site/config';

const BASE_OWNER = 'sambecker';
const BASE_REPO = 'exif-photo-blog';

type RepoParams = Parameters<(owner?: string, repo?: string) => unknown>;

const getRepoUrl = (owner = BASE_OWNER, repo = BASE_REPO) =>
  `https://api.github.com/repos/${owner}/${repo}`;

const getCommitsUrl = (...args: RepoParams) =>
  `${getRepoUrl(...args)}/commits/main`;

export const fetchLatestBaseRepoCommitSha = async () => {
  if (VERCEL_IS_PROVIDER_GITHUB) {
    const response = await fetch(getCommitsUrl());
    const data = await response.json();
    return data.sha.slice(0, 7);
  } else {
    return undefined;
  }
};

export const isRepoForkedFromBase = async (...args: RepoParams) => {
  if (VERCEL_IS_PROVIDER_GITHUB) {
    const response = await fetch(getRepoUrl(...args));
    const data = await response.json();
    return data.fork && data.source?.full_name === `${BASE_OWNER}/${BASE_REPO}`;
  } else {
    return false;
  }
};
