import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import YearImageResponse from '@/year/YearImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ year: string }> },
) {
  const { year } = await context.params;

  return cachedOgPhotoResponse(
    { year },
    { year, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <YearImageResponse {...{ year, ...args }} />,
  );
}
