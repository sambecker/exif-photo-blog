import { getPhotos } from '@/photo/db/query';
import { OUTDATED_THRESHOLD } from '@/photo';
import AdminOutdatedClient from '@/admin/AdminOutdatedClient';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';

export const maxDuration = 60;

export default async function AdminOutdatedPage() {
  const photos = await getPhotos({
    hidden: 'include',
    sortBy: 'createdAtAsc',
    updatedBefore: OUTDATED_THRESHOLD,
    limit: 1_000,
  }).catch(() => []);

  return (
    <AdminOutdatedClient {...{
      photos,
      hasAiTextGeneration: AI_TEXT_GENERATION_ENABLED,
    }} />
  );
}
