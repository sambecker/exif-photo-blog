import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import RecentsImageResponse from
  '@/recents/RecentsImageResponse';
import { getAppText } from '@/i18n/state/server';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET() {
  const title = await getAppText()
    .then(({ category }) => category.recentPlural.toLocaleUpperCase());

  return cachedOgPhotoResponse(
    { recent: true },
    { recent: true, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <RecentsImageResponse {...{ title, ...args }} />,
  );
}
