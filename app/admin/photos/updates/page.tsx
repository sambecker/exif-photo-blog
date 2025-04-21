import AdminPhotosSyncClient from '@/admin/AdminPhotosSyncClient';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getPhotosInNeedOfSync } from '@/photo/db/query';

export const maxDuration = 60;

export default async function AdminUpdatesPage() {
  const photos = await getPhotosInNeedOfSync()
    .catch(() => []);

  return (
    <AdminPhotosSyncClient {...{
      photos,
      hasAiTextGeneration: AI_TEXT_GENERATION_ENABLED,
    }} />
  );
}
