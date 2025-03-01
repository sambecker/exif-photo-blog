import { getOutdatedPhotosCount } from '@/photo/db/query';
import { getSignificantInsights } from '.';
import { getGitHubMetaForCurrentApp } from '.';

export const getShouldShowInsightsIndicator = async () => {
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
    noConfiguredDomain,
    outdatedPhotos,
  } = getSignificantInsights({
    codeMeta,
    photosCountOutdated,
  });

  if (noAiRateLimiting || noConfiguredDomain) {
    return 'yellow';
  } else if (forkBehind || outdatedPhotos) {
    return 'blue';
  }
};
