import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueFocalLengths,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';
import {
  APP_CONFIGURATION,
  GRID_HOMEPAGE_ENABLED,
  HAS_STATIC_OPTIMIZATION,
  MATTE_PHOTOS,
} from '@/app/config';
import { getGitHubMetaForCurrentApp, getSignificantInsights } from '.';
import { getOutdatedPhotosCount } from '@/photo/db/query';

const BASIC_PHOTO_INSTALLATION_COUNT = 32;

export default async function AdminAppInsights() {
  const [
    { count: photosCount, dateRange },
    { count: photosCountHidden },
    photosCountOutdated,
    { count: photosCountPortrait },
    tags,
    cameras,
    filmSimulations,
    focalLengths,
    codeMeta,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getPhotosMeta({ hidden: 'only' }),
    getOutdatedPhotosCount(),
    getPhotosMeta({ maximumAspectRatio: 0.9 }),
    getUniqueTags(),
    getUniqueCameras(),
    getUniqueFilmSimulations(),
    getUniqueFocalLengths(),
    getGitHubMetaForCurrentApp(),
  ]);
  
  const { isAiTextGenerationEnabled } = APP_CONFIGURATION;

  const {
    forkBehind,
    noAiRateLimiting,
    outdatedPhotos,
  } = getSignificantInsights({
    codeMeta,
    photosCountOutdated,
  });

  return (
    <AdminAppInsightsClient
      codeMeta={codeMeta}
      insights={{
        noFork: !codeMeta?.isForkedFromBase && !codeMeta?.isBaseRepo,
        forkBehind,
        noAi: !isAiTextGenerationEnabled,
        noAiRateLimiting,
        outdatedPhotos,
        photoMatting: photosCountPortrait > 0 && !MATTE_PHOTOS,
        gridFirst: (
          photosCount >= BASIC_PHOTO_INSTALLATION_COUNT &&
          !GRID_HOMEPAGE_ENABLED
        ),
        noStaticOptimization: !HAS_STATIC_OPTIMIZATION,
      }}
      photoStats={{
        photosCount,
        photosCountHidden,
        photosCountOutdated,
        tagsCount: tags.length,
        camerasCount: cameras.length,
        filmSimulationsCount: filmSimulations.length,
        focalLengthsCount: focalLengths.length,
        dateRange,
      }}
    />
  );
}
