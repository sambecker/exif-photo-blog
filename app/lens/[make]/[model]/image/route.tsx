import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import { getUniqueLenses } from '@/photo/query';
import {
  getLensFromParams,
  LensProps,
  safelyGenerateLensStaticParams,
} from '@/lens';
import LensImageResponse from '@/lens/LensImageResponse';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'lenses',
  'image',
  getUniqueLenses,
  safelyGenerateLensStaticParams,
);

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
