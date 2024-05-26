import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/image-response';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import FocalLengthImageResponse from
  '@/image-response/FocalLengthImageResponse';
import { getFocalLengthFromString } from '@/focal';

export async function GET(
  _: Request,
  context: { params: { focal: string } },
) {
  const focal = getFocalLengthFromString(context.params.focal);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_PER_TAG, focal }),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <FocalLengthImageResponse {...{
      focal,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
