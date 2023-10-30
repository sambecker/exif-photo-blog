import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_OG,
} from '@/photo/image-response';
import HomeImageResponse from '@/photo/image-response/HomeImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  const [
    photos,
    headers,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG }),
    getImageCacheHeadersForAuth(await auth()),
    getIBMPlexMonoMedium(),
  ]);

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <HomeImageResponse {...{ photos, width, height, fontFamily }}/>,
    { width, height, headers, fonts },
  );
}
