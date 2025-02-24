import AdminOutdatedClient from '@/admin/AdminOutdatedClient';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getOutdatedPhotos } from '@/photo/db/query';

export const maxDuration = 60;

export default async function AdminOutdatedPage() {
  const photos = await getOutdatedPhotos()
    .catch(() => []);

  return (
    <AdminOutdatedClient {...{
      photos,
      hasAiTextGeneration: AI_TEXT_GENERATION_ENABLED,
    }} />
  );
}
