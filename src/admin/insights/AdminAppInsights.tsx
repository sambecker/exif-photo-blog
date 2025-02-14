import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueLenses,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';
import {
  APP_CONFIGURATION,
  GRID_HOMEPAGE_ENABLED,
  HAS_STATIC_OPTIMIZATION,
  IS_DEVELOPMENT,
  IS_VERCEL_GIT_PROVIDER_GITHUB,
  MATTE_PHOTOS,
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/app-core/config';
import { getGitHubMetaWithFallback } from '../github';

const owner   = VERCEL_GIT_REPO_OWNER;
const repo    = VERCEL_GIT_REPO_SLUG;
const branch  = VERCEL_GIT_BRANCH;
const commit  = VERCEL_GIT_COMMIT_SHA;

export default async function AdminAppInsights() {
  const [
    { count: photosCount, dateRange },
    { count: photosCountHidden },
    { count: photosCountPortrait },
    tags,
    cameras,
    filmSimulations,
    lenses,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getPhotosMeta({ hidden: 'only' }),
    getPhotosMeta({ maximumAspectRatio: 0.9 }),
    getUniqueTags(),
    getUniqueCameras(),
    getUniqueFilmSimulations(),
    getUniqueLenses(),
  ]);

  const {
    isAiTextGenerationEnabled,
    hasVercelBlobStorage,
  } = APP_CONFIGURATION;

  const codeMeta = IS_VERCEL_GIT_PROVIDER_GITHUB || IS_DEVELOPMENT
    ? await getGitHubMetaWithFallback({
      owner,
      repo,
      branch,
      commit,
    })
    : undefined;

  return (
    <AdminAppInsightsClient
      codeMeta={codeMeta}
      recommendations={{
        noFork: !codeMeta?.isForkedFromBase && !codeMeta?.isBaseRepo,
        forkBehind: Boolean(codeMeta?.isBehind),
        noAi: !isAiTextGenerationEnabled,
        noAiRateLimiting: isAiTextGenerationEnabled && !hasVercelBlobStorage,
        photoMatting: photosCountPortrait > 0 && !MATTE_PHOTOS,
        gridFirst: photosCount > 32 && !GRID_HOMEPAGE_ENABLED,
        noStaticOptimization: !HAS_STATIC_OPTIMIZATION,
      }}
      photoStats={{
        photosCount,
        photosCountHidden,
        tagsCount: tags.length,
        camerasCount: cameras.length,
        filmSimulationsCount: filmSimulations.length,
        lensesCount: lenses.length,
        dateRange,
      }}
      debug={IS_DEVELOPMENT}
    />
  );
}
