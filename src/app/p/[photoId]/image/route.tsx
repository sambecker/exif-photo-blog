import { getPhotoCached } from '@/photo/cache';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import PhotoImageResponse from '@/image-response/PhotoImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';

export async function GET(
  _: Request,
  context: { params: { photoId: string } },
) {
  const [
    photo,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotoCached(context.params.photoId),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
  ]);
  
  if (!photo) { return new Response('Photo not found', { status: 404 }); }

  const { width, height } = IMAGE_OG_DIMENSION;
  
  return new ImageResponse(
    <PhotoImageResponse {...{ photo, width, height, fontFamily }} />,
    { width, height, fonts, headers },
  );
}
