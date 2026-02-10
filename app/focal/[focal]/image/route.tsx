import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import FocalLengthImageResponse from '@/focal/FocalLengthImageResponse';
import { getFocalLengthFromString } from '@/focal';
import { cachedOgPhotoResponse } from '@/image-response/photo';

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
