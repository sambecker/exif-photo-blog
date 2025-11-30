import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import FocalLengthImageResponse from '@/focal/FocalLengthImageResponse';
import { formatFocalLength, getFocalLengthFromString } from '@/focal';
import { getUniqueFocalLengths } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'focal-lengths',
  'image',
  getUniqueFocalLengths,
  focalLengths => focalLengths
    .map(({ focal }) => ({ focal: formatFocalLength(focal) })),
);

export async function GET(
  _: Request,
  context: { params: Promise<{ focal: string }> },
) {
  const focalString = (await context.params).focal;

  const focal = getFocalLengthFromString(focalString);

  return cachedOgPhotoResponse(
    { focal },
    { focal, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <FocalLengthImageResponse {...{ focal, ...args }} />,
  );
}
