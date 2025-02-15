import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import {
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
  VERCEL_GIT_COMMIT_SHA,
} from '@/site/config';
import { getGitHubMetaWithFallback, getGitHubRepoUrl } from '.';

export default async function GitHubForkStatusBadgeServer() {
  const owner = VERCEL_GIT_REPO_OWNER;
  const repo = VERCEL_GIT_REPO_SLUG;
  const branch = VERCEL_GIT_BRANCH;
  const commit = VERCEL_GIT_COMMIT_SHA;

  const {
    url,
    isForkedFromBase,
    isBaseRepo,
    isBehind,
    label,
    description,
    didError,
  } = await getGitHubMetaWithFallback({ owner, repo, branch, commit });

  const repoLink = (text: string) =>
    <a
      href={getGitHubRepoUrl({ owner, repo })}
      target="_blank"
      className="underline hover:no-underline hover:text-main"
    >
      {text}
    </a>;

  const isBehindContent = <>
    {' '}
    {repoLink('Sync on GitHub')} for latest updates.
  </>;

  const didErrorContent = <>
    {' '}
    Could not connect to {repoLink('GitHub')}.
  </>;

  return isForkedFromBase || isBaseRepo
    ? <GitHubForkStatusBadgeClient {...{
      url,
      label,
      tooltip: <>
        {description}
        {didError
          ? didErrorContent
          : isBehind
            ? isBehindContent
            : null}
      </>,
      style: didError || isBehind === undefined || isBehind
        ? 'warning'
        : 'mono',
    }} />
    : null;
}
