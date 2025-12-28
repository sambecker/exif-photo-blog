import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import FilmImageResponse from '@/film/FilmImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: { params: Promise<{ film: string }> },
) {
  const { film } = await context.params;

  return cachedOgPhotoResponse(
    { film },
    { film, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <FilmImageResponse {...{ film, ...args }} />,
  );
}
