import { auth } from '@/auth';
import { getImageCacheHeadersForAuth } from '@/cache';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_HOME,
} from '@/photo/image-response';
import HomeImageResponse from '@/photo/image-response/HomeImageResponse';
import { getPhotos } from '@/services/postgres';
import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request): Promise<ImageResponse> {
  const photos = await getPhotos(
    undefined,
    MAX_PHOTOS_TO_SHOW_HOME,
  );

  const headers = await getImageCacheHeadersForAuth(await auth());

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <HomeImageResponse {...{ photos, request, width, height }}/>,
    { width, height, headers },
  );
}
