import {
  TEMPLATE_REPO_OWNER,
  TEMPLATE_REPO_NAME,
  TEMPLATE_REPO_BRANCH,
} from '@/app-core/config';

const DEFAULT_BRANCH = 'main';
const FALLBACK_TEXT = 'Unknown';
const CACHE_GITHUB_REQUESTS = false;

// Cache all results for 2 minutes to avoid rate limiting
// GitHub API requests limited to 60 requests per hour
const FETCH_CONFIG: RequestInit | undefined= CACHE_GITHUB_REQUESTS
  ? { next: { revalidate: 120 } } : undefined;

interface RepoParams {
  owner?: string
  repo?: string
  branch?: string
  commit?: string
};

// Website urls

export const getGitHubUrlOwner = ({
  owner = TEMPLATE_REPO_OWNER,
}: RepoParams = {}) =>
  `https://github.com/${owner}`;

export const getGitHubUrlRepo = ({
  owner = TEMPLATE_REPO_OWNER,
  repo = TEMPLATE_REPO_NAME,
}: RepoParams = {}) =>
  `${getGitHubUrlOwner({ owner })}/${repo}`;

export const getGitHubUrlBranch = ({
  owner = TEMPLATE_REPO_OWNER,
  repo = TEMPLATE_REPO_NAME,
  branch = DEFAULT_BRANCH,
}: RepoParams = {}) =>
  `${getGitHubUrlRepo({ owner, repo })}/tree/${branch}`;

export const getGitHubUrlCommit = ({
  owner = TEMPLATE_REPO_OWNER,
  repo = TEMPLATE_REPO_NAME,
  commit,
}: RepoParams = {}) =>
  commit
    ? `${getGitHubUrlRepo({ owner, repo })}/commit/${commit}`
    : undefined;

export const getGitHubUrlCompare = ({
  owner,
  repo,
  branch = DEFAULT_BRANCH,
}: RepoParams = {}) =>
  // eslint-disable-next-line max-len
  `${getGitHubUrlRepo({ owner, repo })}/compare/${branch}...${TEMPLATE_REPO_OWNER}:${TEMPLATE_REPO_NAME}:${TEMPLATE_REPO_BRANCH}`;

// API urls

const getGitHubApiRepoUrl = ({
  owner = TEMPLATE_REPO_OWNER,
  repo = TEMPLATE_REPO_NAME,
}: RepoParams = {}) =>
  `https://api.github.com/repos/${owner}/${repo}`;

const getGitHubApiCommitsUrl = (params?: RepoParams) =>
  `${getGitHubApiRepoUrl(params)}/commits/${params?.branch || DEFAULT_BRANCH}`;

const getGitHubApiForksUrl = (params?: RepoParams) =>
  `${getGitHubApiRepoUrl(params)}/forks`;

const getGitHubApiCompareToRepoUrl = ({
  owner,
  repo,
  branch = DEFAULT_BRANCH,
}: RepoParams = {}) =>
  // eslint-disable-next-line max-len
  `${getGitHubApiRepoUrl()}/compare/${TEMPLATE_REPO_BRANCH}...${owner}:${repo}:${branch}`;

const getGitHubApiCompareToCommitUrl = ({ commit }: RepoParams = {}) =>
  `${getGitHubApiRepoUrl()}/compare/${TEMPLATE_REPO_BRANCH}...${commit}`;

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
    data.source?.full_name === `${TEMPLATE_REPO_OWNER}/${TEMPLATE_REPO_NAME}`
  );
};

const getGitHubCommitsBehindFromRepo = async (params?: RepoParams) => {
  const response = await fetch(
    getGitHubApiCompareToRepoUrl(params),
    FETCH_CONFIG,
  );
  const data = await response.json();
  return data.behind_by as number;
};

const getGitHubCommitsBehindFromCommit = async (params?: RepoParams) => {
  const response = await fetch(
    getGitHubApiCompareToCommitUrl(params),
    FETCH_CONFIG,
  );
  const data = await response.json();
  return data.behind_by as number;
};

const isRepoBaseRepo = ({ owner, repo }: RepoParams) =>
  owner?.toLowerCase() === TEMPLATE_REPO_OWNER &&
  repo?.toLowerCase() === TEMPLATE_REPO_NAME;

export const getGitHubPublicFork = async (): Promise<RepoParams> => {
  const response = await fetch(getGitHubApiForksUrl(), FETCH_CONFIG);
  const fork = (await response.json())[0];
  return {
    owner: fork?.owner.login,
    repo: fork?.name,
  };
};

const getGitHubMeta = async (params: RepoParams) => {
  const urlOwner = getGitHubUrlOwner(params);
  const urlRepo = getGitHubUrlRepo(params);
  const urlBranch = getGitHubUrlBranch(params);
  const urlCommit = getGitHubUrlCommit(params);

  const isBaseRepo = isRepoBaseRepo(params);

  const [
    isForkedFromBase,
    behindBy,
  ] = await Promise.all([
    getIsRepoForkedFromBase(params),
    isBaseRepo && params.commit
      ? getGitHubCommitsBehindFromCommit(params)
      : getGitHubCommitsBehindFromRepo(params),
  ]);

  const isBehind = behindBy === undefined
    ? undefined
    : behindBy > 0;

  const label = isBehind === undefined
    ? FALLBACK_TEXT
    : isBehind
      ? `${behindBy} Behind`
      : 'Synced';

  const description = isBehind === undefined
    ? FALLBACK_TEXT
    : isBehind
      ? `This fork is ${behindBy} commit${behindBy === 1 ? '' : 's'} behind.`
      : isBaseRepo
        ? 'This build is up to date.'
        : 'This fork is up to date.';

  return {
    ...params,
    urlOwner,
    urlRepo,
    urlBranch,
    urlCommit,
    isForkedFromBase,
    isBaseRepo,
    behindBy,
    isBehind,
    label,
    description,
    didError: false,
  };
};

export const getGitHubMetaWithFallback = (params: RepoParams) =>
  getGitHubMeta(params)
    .catch(e => {
      console.error('Error retrieving GitHub meta', { params, error: e });
      return {
        ...params,
        commitMessage: undefined,
        urlOwner: undefined,
        urlRepo: undefined,
        urlBranch: undefined,
        urlCommit: undefined,
        isForkedFromBase: false,
        isBaseRepo: undefined,
        behindBy: undefined,
        isBehind: undefined,
        label: FALLBACK_TEXT,
        description: 'Could not connect to GitHub.',
        didError: true,
      };
    });
