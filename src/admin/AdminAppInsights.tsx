import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueLenses,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';
import { APP_CONFIGURATION, IS_DEVELOPMENT } from '@/app-core/config';
export default async function AdminAppInsights() {
  const [
    { count, dateRange },
    tags,
    cameras,
    filmSimulations,
    lenses,
  ] = await Promise.all([
    getPhotosMeta({ hidden: 'include' }),
    getUniqueTags(),
    getUniqueCameras(),
    getUniqueFilmSimulations(),
    getUniqueLenses(),
  ]);

  const {
    isAiTextGenerationEnabled,
    hasVercelBlobStorage,
  } = APP_CONFIGURATION;

  return (
    <AdminAppInsightsClient
      recommendations={{
        fork: true,
        forkBehind: true,
        ai: isAiTextGenerationEnabled,
        aiRateLimiting: isAiTextGenerationEnabled && !hasVercelBlobStorage,
      }}
      photoStats={{
        photosCount: count,
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
