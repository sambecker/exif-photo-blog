import { Suspense } from 'react';
import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import GitHubForkStatusBadgeServer from './GitHubForkStatusBadgeServer';
import { IS_DEVELOPMENT, IS_VERCEL_GIT_PROVIDER_GITHUB } from '@/site/config';

export default function GitHubForkStatusBadge() {
  return IS_DEVELOPMENT
    ? <GitHubForkStatusBadgeClient label="Local" />
    : IS_VERCEL_GIT_PROVIDER_GITHUB
      ? <Suspense>
        <GitHubForkStatusBadgeServer />
      </Suspense>
      : null;
}
