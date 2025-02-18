'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import {
  getGitHubMetaForCurrentApp,
  getSignificantInsights,
  InsightIndicatorStatus,
} from '.';
import { getPhotosMeta } from '@/photo/db/query';
import { OUTDATED_THRESHOLD } from '@/photo';

export const getShouldShowInsightsIndicatorAction =
  async (): Promise<InsightIndicatorStatus> =>
    runAuthenticatedAdminServerAction(async () => {
      const [
        codeMeta,
        { count: photosCountOutdated },
      ] = await Promise.all([
        getGitHubMetaForCurrentApp(),
        getPhotosMeta({ hidden: 'include', updatedBefore: OUTDATED_THRESHOLD }),
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
