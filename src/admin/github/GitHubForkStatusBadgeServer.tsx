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
  } = await getGitHubMeta({ owner, repo })
    .catch(() => {
      console.log('Error getting GitHub meta', { owner, repo });
      return {
        url: undefined,
        label: undefined,
        title: undefined,
        isBehind: false,
      };
    });

  return (
    <GitHubForkStatusBadgeClient {...{
      url,
      label,
      title,
      style: isBehind ? 'warning' : 'mono',
    }} />
  );
}
