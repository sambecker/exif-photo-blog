import { Suspense } from 'react';
import GitHubForkStatusBadgeClient from './GitHubForkStatusBadgeClient';
import GitHubForkStatusBadgeServer from './GitHubForkStatusBadgeServer';
import { IS_DEVELOPMENT } from '@/app-core/config';

export default function GitHubForkStatusBadge() {
  return IS_DEVELOPMENT
    ? <GitHubForkStatusBadgeClient
      label="Local"
      tooltip="GitHub status unknown when running locally."
    />
    : <Suspense>
      <GitHubForkStatusBadgeServer />
    </Suspense>;
}
