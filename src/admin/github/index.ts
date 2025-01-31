const BASE_OWNER  = 'sambecker';
const BASE_REPO   = 'exif-photo-blog';

interface RepoParams {
  owner?: string
  repo?: string
  branch?: string
};

// Urls

const getGitHubRepoUrl = ({
  owner = BASE_OWNER,
  repo = BASE_REPO,
}: RepoParams = {}) =>
  `https://github.com/${owner}/${repo}`;

const getGitHubApiRepoUrl = ({
  owner = BASE_OWNER,
  repo = BASE_REPO,
}: RepoParams = {}) =>
  `https://api.github.com/repos/${owner}/${repo}`;

const getGitHubApiCommitsUrl = (params?: RepoParams) =>
  `${getGitHubApiRepoUrl(params)}/commits/main`;

// Fetching

const getGitHubApiCompareUrl = ({
  owner,
  repo,
  branch = 'main',
}: RepoParams = {}) =>
  `${getGitHubApiRepoUrl()}/compare/main...${owner}:${repo}:${branch}`;

const getLatestBaseRepoCommitSha = async () => {
  const response = await fetch(getGitHubApiCommitsUrl());
  const data = await response.json();
  return data.sha.slice(0, 7) as string;
};

const getIsRepoForkedFromBase = async (params: RepoParams) => {
  const response = await fetch(getGitHubApiRepoUrl(params));
  const data = await response.json();
  return data.fork && data.source?.full_name === `${BASE_OWNER}/${BASE_REPO}`;
};

const getGitHubCommitsBehind = async (params?: RepoParams) => {
  const response = await fetch(getGitHubApiCompareUrl(params));
  const data = await response.json();
  return data.behind_by as number;
};

const isRepoBaseRepo = async ({ owner, repo }: RepoParams) =>
  owner?.toLowerCase() === BASE_OWNER &&
  repo?.toLowerCase() === BASE_REPO;

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
