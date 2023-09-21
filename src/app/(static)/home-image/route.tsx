import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_HOME,
} from '@/photo/image-response';
import HomeImageResponse from '@/photo/image-response/HomeImageResponse';
import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: Request) {
  const photos = await getPhotosCached({
    limit: MAX_PHOTOS_TO_SHOW_HOME,
  });

  const headers = await getImageCacheHeadersForAuth(await auth());

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <HomeImageResponse {...{ photos, request, width, height }}/>,
    { width, height, headers },
  );
}
