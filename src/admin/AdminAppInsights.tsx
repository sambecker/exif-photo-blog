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
  IS_VERCEL_GIT_PROVIDER_GITHUB,
  VERCEL_GIT_BRANCH,
  VERCEL_GIT_COMMIT_SHA,
  VERCEL_GIT_REPO_OWNER,
  VERCEL_GIT_REPO_SLUG,
} from '@/app-core/config';
import { getGitHubMetaWithFallback } from './github';

const owner   = VERCEL_GIT_REPO_OWNER;
const repo    = VERCEL_GIT_REPO_SLUG;
const branch  = VERCEL_GIT_BRANCH;
const commit  = VERCEL_GIT_COMMIT_SHA;

export default async function AdminAppInsights() {
  const [
    { count, dateRange },
    { count: countHidden },
    tags,
    cameras,
    filmSimulations,
    lenses,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getPhotosMeta({ hidden: 'only' }),
    getUniqueTags(),
    getUniqueCameras(),
    getUniqueFilmSimulations(),
    getUniqueLenses(),
  ]);

  const {
    isAiTextGenerationEnabled,
    hasVercelBlobStorage,
  } = APP_CONFIGURATION;

  const codeMeta = IS_VERCEL_GIT_PROVIDER_GITHUB
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
        fork: true,
        forkBehind: true,
        ai: isAiTextGenerationEnabled,
        aiRateLimiting: isAiTextGenerationEnabled && !hasVercelBlobStorage,
        photoMatting: true,
        gridFirst: true,
      }}
      photoStats={{
        photosCount: count,
        photosCountHidden: countHidden,
        tagsCount: tags.length,
        camerasCount: cameras.length,
        filmSimulationsCount: filmSimulations.length,
        lensesCount: lenses.length,
        dateRange,
      }}
      debug
    />
  );
}
