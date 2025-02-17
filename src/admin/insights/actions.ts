'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import { getGitHubMetaForCurrentApp, getSignificantInsights } from '.';
import { getPhotosMeta } from '@/photo/db/query';
import { OUTDATED_THRESHOLD } from '@/photo';

export const getShouldShowInsightsIndicatorAction = async () =>
  runAuthenticatedAdminServerAction(async () => {
    const [
      codeMeta,
      { count: photosCountOutdated },
    ] = await Promise.all([
      getGitHubMetaForCurrentApp(),
      getPhotosMeta({ hidden: 'include', updatedBefore: OUTDATED_THRESHOLD }),
    ]);
    
    const significantInsights = getSignificantInsights({
      codeMeta,
      photosCountOutdated,
    });

    return Object
      .values(significantInsights)
      .some(Boolean);
  });
