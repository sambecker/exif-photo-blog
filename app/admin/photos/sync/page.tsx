import AdminPhotosSyncClient from '@/admin/AdminPhotosSyncClient';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getOutdatedPhotos } from '@/photo/db/query';

export const maxDuration = 60;

export default async function AdminSyncPage() {
  const photos = await getOutdatedPhotos()
    .catch(() => []);

  return (
    <AdminPhotosSyncClient {...{
      photos,
      hasAiTextGeneration: AI_TEXT_GENERATION_ENABLED,
    }} />
  );
}
