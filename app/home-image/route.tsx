import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_OG,
} from '@/image-response';
import HomeImageResponse from '@/image-response/HomeImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { isNextImageReadyBasedOnPhotos } from '@/photo';
import { APP_OG_IMAGE_QUERY_OPTIONS } from '@/feed';

export const dynamic = 'force-static';

export async function GET() {
  const [
    photos,
    headers,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      ...APP_OG_IMAGE_QUERY_OPTIONS,
      limit: MAX_PHOTOS_TO_SHOW_OG,
    })
      .catch(() => []),
    getImageResponseCacheControlHeaders(),
    getIBMPlexMono(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  // Make sure next/image can be reached from absolute urls,
  // which may not exist on first pre-render
  const isNextImageReady = await isNextImageReadyBasedOnPhotos(photos);

  return new ImageResponse(
    <HomeImageResponse {...{
      photos: isNextImageReady ? photos : [],
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, headers, fonts },
  );
}
