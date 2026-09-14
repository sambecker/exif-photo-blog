import AdminPhotosUpdateClient from '@/admin/AdminPhotosUpdateClient';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { getPhotosInNeedOfUpdate } from '@/photo/query';

export const maxDuration = 60;

export default async function AdminUpdatesPage() {
  const photos = await getPhotosInNeedOfUpdate()
    .catch(() => []);

  return (
    <AdminPhotosUpdateClient {...{
      photos,
      hasAiContentGeneration: AI_CONTENT_GENERATION_ENABLED,
    }} />
  );
}
