import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueTags,
} from '@/photo/db/query';
import AdminAppInsightsClient from './AdminAppInsightsClient';

export default async function AdminAppInsights() {
  const [
    { count, dateRange },
    tags,
    cameras,
  ] = await Promise.all([
    getPhotosMeta(),
    getUniqueTags(),
    getUniqueCameras(),
  ]);

  return (
    <AdminAppInsightsClient
      photosCount={count}
      tagsCount={tags.length}
      camerasCount={cameras.length}
      dateRange={dateRange}
    />
  );
}
