'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import {
  getGitHubMetaForCurrentApp,
  getSignificantInsights,
  InsightIndicatorStatus,
} from '.';
import { getOutdatedPhotosCount } from '@/photo/db/query';

export const getShouldShowInsightsIndicatorAction =
  async (): Promise<InsightIndicatorStatus> =>
    runAuthenticatedAdminServerAction(async () => {
      const [
        codeMeta,
        photosCountOutdated,
      ] = await Promise.all([
        getGitHubMetaForCurrentApp(),
        getOutdatedPhotosCount(),
      ]);
      
      const {
        forkBehind,
        noAiRateLimiting,
        outdatedPhotos,
      } = getSignificantInsights({
        codeMeta,
        photosCountOutdated,
      });

      if (noAiRateLimiting || outdatedPhotos) {
        return 'yellow';
      } else if (forkBehind) {
        return 'blue';
      }
    });
