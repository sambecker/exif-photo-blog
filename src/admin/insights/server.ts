import { getPhotosInNeedOfSyncCount } from '@/photo/db/query';
import {
  getSignificantInsights,
  indicatorStatusForSignificantInsights,
} from '.';
import { getGitHubMetaForCurrentApp } from '.';

export const getInsightsIndicatorStatus = async () => {
  const [
    codeMeta,
    photosCountNeedSync,
  ] = await Promise.all([
    getGitHubMetaForCurrentApp(),
    getPhotosInNeedOfSyncCount(),
  ]);
  
  const significantInsights = getSignificantInsights({
    codeMeta,
    photosCountNeedSync,
  });

  return indicatorStatusForSignificantInsights(significantInsights);
};
