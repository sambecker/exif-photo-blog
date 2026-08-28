import AdminInfoPage from '@/admin/AdminInfoPage';
import AdminAiModelsClient from '@/admin/ai-models/AdminAiModelsClient';
import { AI_MODEL_COMPARISON_PHOTO_COUNT } from '@/admin/ai-models';
import {
  ADMIN_AI_MODEL_DEBUG_ENABLED,
  OPENAI_SECRET_KEY,
} from '@/app/config';
import EnvVar from '@/components/EnvVar';
import { getPhotosNoStore } from '@/photo/cache';
import { getPhotoIds } from '@/photo/query';
import { shuffleArray } from '@/utility/array';

export const maxDuration = 60;

// The photo query layer has no random sort, so ids—a cheap, id-only
// select—are shuffled and only the winners fetched in full. Re-runs on
// every request, which is what makes the client's shuffle button work.
const getRandomPhotos = async (count: number) => {
  const photoIds = await getPhotoIds({ limit: 1_000 }).catch(() => []);

  return getPhotosNoStore({
    photoIds: shuffleArray(photoIds).slice(0, count),
    hidden: 'include',
    limit: count,
  });
};

export default async function AdminAiModelsPage() {
  if (!ADMIN_AI_MODEL_DEBUG_ENABLED) {
    return <AdminInfoPage>
      <div>
        Set
        {' '}
        <EnvVar variable="ADMIN_AI_MODEL_DEBUG" />
        {' '}
        to {'"1"'} to enable AI model comparisons
      </div>
    </AdminInfoPage>;
  }

  const photos = await getRandomPhotos(AI_MODEL_COMPARISON_PHOTO_COUNT)
    .catch(() => []);

  return <AdminAiModelsClient
    photos={photos}
    hasOpenAiSecretKey={Boolean(OPENAI_SECRET_KEY)}
  />;
}
