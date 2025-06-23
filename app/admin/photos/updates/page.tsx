import AdminPhotosSyncClient from '@/admin/AdminPhotosSyncClient';
import { AI_TEXT_GENERATION_ENABLED, USE_IMMICH_BACKEND } from '@/app/config';
import { getPhotosInNeedOfSync } from '@/photo/db/query';

export const maxDuration = 60;

export default async function AdminUpdatesPage() {
  // Skip database queries when using Immich backend
  const photos = USE_IMMICH_BACKEND ? [] : await getPhotosInNeedOfSync()
    .catch(() => []);

  return (
    <AdminPhotosSyncClient {...{
      photos,
      hasAiTextGeneration: AI_TEXT_GENERATION_ENABLED,
    }} />
  );
}
