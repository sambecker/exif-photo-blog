import {
  TEMPLATE_BASE_OWNER,
  TEMPLATE_BASE_REPO,
  TEMPLATE_BASE_BRANCH,
} from '@/site/config';

const DEFAULT_BRANCH = 'main';

const FALLBACK_TEXT = 'Unknown';

// Cache all results for 2 minutes to avoid rate limiting
// GitHub API requests limited to 60 requests per hour
const FETCH_CONFIG: RequestInit = {
  next: { revalidate: 120 },
};

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

const getGitHubApiForksUrl = (params?: RepoParams) =>
  `${getGitHubApiRepoUrl(params)}/forks`;

const getGitHubApiCompareUrl = ({
  owner,
  repo,
  branch = 'main',
}: RepoParams = {}) =>
  // eslint-disable-next-line max-len
  `${getGitHubApiRepoUrl()}/compare/${TEMPLATE_BASE_BRANCH}...${owner}:${repo}:${branch}`;

// Requests

export const getLatestBaseRepoCommitSha = async () => {
  const response = await fetch(getGitHubApiCommitsUrl(), FETCH_CONFIG);
  const data = await response.json();
  return data.sha ? data.sha.slice(0, 7) as string : undefined;
};

const getIsRepoForkedFromBase = async (params: RepoParams) => {
  const response = await fetch(getGitHubApiRepoUrl(params), FETCH_CONFIG);
  const data = await response.json();
  return (
    Boolean(data.fork) &&
    data.source?.full_name === `${TEMPLATE_BASE_OWNER}/${TEMPLATE_BASE_REPO}`
  );
};

const getGitHubCommitsBehind = async (params?: RepoParams) => {
  const response = await fetch(getGitHubApiCompareUrl(params), FETCH_CONFIG);
  const data = await response.json();
  return data.behind_by as number;
};

const isRepoBaseRepo = async ({ owner, repo }: RepoParams) =>
  owner?.toLowerCase() === TEMPLATE_BASE_OWNER &&
  repo?.toLowerCase() === TEMPLATE_BASE_REPO;

export const getGitHubPublicFork = async (
  params?: RepoParams,
): Promise<RepoParams> => {
  const response = await fetch(getGitHubApiForksUrl(params), FETCH_CONFIG);
  const fork = (await response.json())[0];
  return {
    owner: fork.owner.login,
    repo: fork.name,
  };
};

const getGitHubMeta = async (params: RepoParams) => {
  const [
    url,
    isForkedFromBase,
    isBaseRepo,
    behindBy,
  ] = await Promise.all([
    getGitHubRepoUrl(params),
    getIsRepoForkedFromBase(params),
    isRepoBaseRepo(params),
    getGitHubCommitsBehind(params),
  ]);

  const isBehind = behindBy === undefined
    ? undefined
    : behindBy > 0;

  const label = isBehind === undefined
    ? FALLBACK_TEXT
    : isBehind
      ? `${behindBy} Behind`
      : 'Synced';

  const title = isBehind === undefined
    ? FALLBACK_TEXT
    : isBehind
      // eslint-disable-next-line max-len
      ? `This fork is ${behindBy} commit${behindBy === 1 ? '' : 's'} behind. Consider syncing on GitHub for the latest updates.`
      : 'This fork is up to date.';

  return {
    url,
    isForkedFromBase,
    isBaseRepo,
    behindBy,
    isBehind,
    label,
    title,
  };
};

export const getGitHubMetaWithFallback = (params: RepoParams) =>
  getGitHubMeta(params)
    .catch(e => {
      console.error('Error retrieving GitHub meta', { params, error: e });
      return {
        url: undefined,
        isForkedFromBase: false,
        isBaseRepo: undefined,
        behindBy: undefined,
        isBehind: undefined,
        label: FALLBACK_TEXT,
        title: FALLBACK_TEXT,
      };
    });
