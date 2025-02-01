import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/site/config';
import { getGitHubMeta } from '.';

export default async function GitHubForkStatusBadgeServer() {
  const owner = VERCEL_GIT_REPO_OWNER;
  const repo = VERCEL_GIT_REPO_SLUG;
  const branch = VERCEL_GIT_BRANCH;

  const {
    url,
    isForkedFromBase,
    label,
    title,
    isBehind,
  } = await getGitHubMeta({ owner, repo, branch })
    .catch(() => {
      console.error('Error retrieving GitHub meta', { owner, repo, branch });
      return {
        url: undefined,
        isForkedFromBase: false,
        label: undefined,
        title: undefined,
        isBehind: undefined,
      };
    });

  return isForkedFromBase
    ? <GitHubForkStatusBadgeClient {...{
      url,
      label,
      title,
      style: isBehind ? 'warning' : 'mono',
    }} />
    : null;
}
