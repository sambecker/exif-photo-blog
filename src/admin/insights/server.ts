import { getOutdatedPhotosCount } from '@/photo/db/query';
import {
  getSignificantInsights,
  indicatorStatusForSignificantInsights,
} from '.';
import { getGitHubMetaForCurrentApp } from '.';

export const getInsightsIndicatorStatus = async () => {
  const [
    codeMeta,
    photosCountOutdated,
  ] = await Promise.all([
    getGitHubMetaForCurrentApp(),
    getOutdatedPhotosCount(),
  ]);
  
  const significantInsights = getSignificantInsights({
    codeMeta,
    photosCountOutdated,
  });

  return indicatorStatusForSignificantInsights(significantInsights);
};
