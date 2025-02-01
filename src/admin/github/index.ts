import {
  TEMPLATE_BASE_OWNER,
  TEMPLATE_BASE_REPO,
  TEMPLATE_BASE_BRANCH,
} from '@/site/config';

const DEFAULT_BRANCH = 'main';

interface RepoParams {
  owner?: string
  repo?: string
  branch?: string
};

// Website urls

const getGitHubRepoUrl = ({
  owner = TEMPLATE_BASE_OWNER,
  repo = TEMPLATE_BASE_REPO,
}: RepoParams = {}) =>
  `https://github.com/${owner}/${repo}`;

export const getGitHubCompareUrl = ({
  owner,
  repo,
  branch = DEFAULT_BRANCH,
}: RepoParams = {}) =>
  // eslint-disable-next-line max-len
  `${getGitHubRepoUrl({ owner, repo })}/compare/${branch}...${TEMPLATE_BASE_OWNER}:${TEMPLATE_BASE_REPO}:${TEMPLATE_BASE_BRANCH}`;

// API urls

const getGitHubApiRepoUrl = ({
  owner = TEMPLATE_BASE_OWNER,
  repo = TEMPLATE_BASE_REPO,
}: RepoParams = {}) =>
  `https://api.github.com/repos/${owner}/${repo}`;

const getGitHubApiCommitsUrl = (params?: RepoParams) =>
  `${getGitHubApiRepoUrl(params)}/commits/main`;

const getGitHubApiCompareUrl = ({
  owner,
  repo,
  branch = 'main',
}: RepoParams = {}) =>
  // eslint-disable-next-line max-len
  `${getGitHubApiRepoUrl()}/compare/${TEMPLATE_BASE_BRANCH}...${owner}:${repo}:${branch}`;

// Requests

const getLatestBaseRepoCommitSha = async () => {
  const response = await fetch(getGitHubApiCommitsUrl());
  const data = await response.json();
  return data.sha.slice(0, 7) as string;
};

const getIsRepoForkedFromBase = async (params: RepoParams) => {
  const response = await fetch(getGitHubApiRepoUrl(params));
  const data = await response.json();
  return (
    Boolean(data.fork) &&
    data.source?.full_name === `${TEMPLATE_BASE_OWNER}/${TEMPLATE_BASE_REPO}`
  );
};

const getGitHubCommitsBehind = async (params?: RepoParams) => {
  const response = await fetch(getGitHubApiCompareUrl(params));
  const data = await response.json();
  return data.behind_by as number;
};

const isRepoBaseRepo = async ({ owner, repo }: RepoParams) =>
  owner?.toLowerCase() === TEMPLATE_BASE_OWNER &&
  repo?.toLowerCase() === TEMPLATE_BASE_REPO;

export const getGitHubMeta = async (params: RepoParams) => {
  const [
    url,
    isForkedFromBase,
    isBaseRepo,
    latestBaseRepoCommitSha,
    behindBy,
  ] = await Promise.all([
    getGitHubRepoUrl(params),
    getIsRepoForkedFromBase(params),
    isRepoBaseRepo(params),
    getLatestBaseRepoCommitSha(),
    getGitHubCommitsBehind(params),
  ]);

  const isBehind = behindBy > 0;
  const label = isBehind ? `${behindBy} Behind` : 'Synced';
  const title = isBehind
    // eslint-disable-next-line max-len
    ? `This fork is ${behindBy} commit${behindBy === 1 ? '' : 's'} behind. Consider syncing on GitHub for the latest updates.`
    : 'This fork is up to date.';

  return {
    url,
    isForkedFromBase,
    isBaseRepo,
    latestBaseRepoCommitSha,
    behindBy,
    isBehind,
    label,
    title,
  };
};
