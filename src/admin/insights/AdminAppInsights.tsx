import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilms,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';
import {
  APP_CONFIGURATION,
  CATEGORY_VISIBILITY,
  GRID_HOMEPAGE_ENABLED,
  HAS_STATIC_OPTIMIZATION,
  IS_META_TITLE_CONFIGURED,
  IS_META_DESCRIPTION_CONFIGURED,
  MATTE_PHOTOS,
} from '@/app/config';
import { getGitHubMetaForCurrentApp, getSignificantInsights } from '.';
import { getOutdatedPhotosCount } from '@/photo/db/query';

const BASIC_PHOTO_INSTALLATION_COUNT = 32;
const TAG_COUNT_THRESHOLD = 12;

export default async function AdminAppInsights() {
  const [
    { count: photosCount, dateRange },
    { count: photosCountHidden },
    photosCountOutdated,
    { count: photosCountPortrait },
    codeMeta,
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getPhotosMeta({ hidden: 'only' }),
    getOutdatedPhotosCount(),
    getPhotosMeta({ maximumAspectRatio: 0.9 }),
    getGitHubMetaForCurrentApp(),
    getUniqueCameras(),
    getUniqueLenses(),
    getUniqueTags(),
    getUniqueRecipes(),
    getUniqueFilms(),
    getUniqueFocalLengths(),
  ]);
  
  const { isAiTextGenerationEnabled } = APP_CONFIGURATION;

  const {
    forkBehind,
    noAiRateLimiting,
    noConfiguredDomain,
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
        noConfiguredDomain,
        noConfiguredMeta:
          !IS_META_TITLE_CONFIGURED ||
          !IS_META_DESCRIPTION_CONFIGURED,
        outdatedPhotos,
        photoMatting: photosCountPortrait > 0 && !MATTE_PHOTOS,
        camerasFirst: (
          tags.length > TAG_COUNT_THRESHOLD &&
          CATEGORY_VISIBILITY[0] !== 'cameras'
        ),
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
        camerasCount: cameras.length,
        lensesCount: lenses.length,
        tagsCount: tags.length,
        recipesCount: recipes.length,
        filmsCount: films.length,
        focalLengthsCount: focalLengths.length,
        dateRange,
      }}
    />
  );
}
