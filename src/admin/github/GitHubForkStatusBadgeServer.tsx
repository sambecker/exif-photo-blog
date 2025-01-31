import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import {
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/site/config';
import { getGitHubMeta } from '.';

export default async function GitHubForkStatusBadgeServer() {
  const owner = VERCEL_GIT_REPO_OWNER;
  const repo = VERCEL_GIT_REPO_SLUG;
  
  const {
    url,
    label,
    title,
    isBehind,
  } = await getGitHubMeta({ owner, repo });

  return (
    <GitHubForkStatusBadgeClient {...{
      url,
      label,
      title,
      style: isBehind ? 'warning' : 'mono',
    }} />
  );
}
