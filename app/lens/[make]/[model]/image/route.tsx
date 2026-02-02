import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import {
  getLensFromParams,
  LensProps,
} from '@/lens';
import LensImageResponse from '@/lens/LensImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: LensProps,
) {
  const lens = await getLensFromParams(context.params);

  return cachedOgPhotoResponse(
    { lens },
    { lens, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <LensImageResponse {...{ lens, ...args }} />,
  );
}
