import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotoCached } from '@/cache';
import { IMAGE_OG_DIMENSION } from '@/photo/image-response';
import PhotoImageResponse from '@/photo/image-response/PhotoImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

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
    getImageCacheHeadersForAuth(await auth()),
  ]);
  
  if (!photo) { return new Response('Photo not found', { status: 404 }); }

  const { width, height } = IMAGE_OG_DIMENSION;
  
  return new ImageResponse(
    <PhotoImageResponse {...{ photo, width, height, fontFamily }} />,
    { width, height, fonts, headers },
  );
}
