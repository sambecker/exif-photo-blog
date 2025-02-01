import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/site/config';
import { getGitHubMetaWithFallback } from '.';

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
  } = await getGitHubMetaWithFallback({ owner, repo, branch });

  return isForkedFromBase
    ? <GitHubForkStatusBadgeClient {...{
      url,
      label,
      title,
      style: isBehind === undefined || isBehind ? 'warning' : 'mono',
    }} />
    : null;
}
