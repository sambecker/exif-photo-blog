import { getPhotosCached } from '@/photo/cache';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_OG,
} from '@/image-response';
import HomeImageResponse from '@/image-response/HomeImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { SHOULD_USE_EDGE_RUNTIME } from '@/site/config';

export let runtime: 'edge' | 'nodejs';
if (SHOULD_USE_EDGE_RUNTIME) { runtime = 'edge'; }

export async function GET() {
  const [
    photos,
    headers,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_OG }),
    getImageResponseCacheControlHeaders(),
    getIBMPlexMonoMedium(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <HomeImageResponse {...{ photos, width, height, fontFamily }}/>,
    { width, height, headers, fonts },
  );
}
