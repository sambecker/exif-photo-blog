import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_HOME,
} from '@/photo/image-response';
import HomeImageResponse from '@/photo/image-response/HomeImageResponse';
import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const [
    photos,
    headers,
  ] = await Promise.all([
    getPhotosCached({ limit: MAX_PHOTOS_TO_SHOW_HOME }),
    getImageCacheHeadersForAuth(await auth()),
  ]);

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <HomeImageResponse {...{ photos, width, height }}/>,
    { width, height, headers },
  );
}
