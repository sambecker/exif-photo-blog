import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilmSimulations,
  getUniqueLenses,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';

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

  return (
    <AdminAppInsightsClient
      photosCount={count}
      tagsCount={tags.length}
      camerasCount={cameras.length}
      filmSimulationsCount={filmSimulations.length}
      lensesCount={lenses.length}
      dateRange={dateRange}
    />
  );
}
