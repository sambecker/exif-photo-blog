import { getPhotoCached } from '@/photo/cache';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import PhotoImageResponse from '@/image-response/PhotoImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { isNextImageReadyBasedOnPhotos } from '@/photo';
import { staticallyGeneratePhotosIfConfigured } from '@/app/static';

export const generateStaticParams = staticallyGeneratePhotosIfConfigured(
  'image',
);

export async function GET(
  _: Request,
  context: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await context.params;

  const [
    photo,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotoCached(photoId),
    getIBMPlexMono(),
    getImageResponseCacheControlHeaders(),
  ]);
  
  if (!photo) { return new Response('Photo not found', { status: 404 }); }

  const { width, height } = IMAGE_OG_DIMENSION;

  // Make sure next/image can be reached from absolute urls,
  // which may not exist on first pre-render
  const isNextImageReady = await isNextImageReadyBasedOnPhotos([photo]);
  
  return new ImageResponse(
    <PhotoImageResponse {...{
      photo,
      width,
      height,
      fontFamily,
      isNextImageReady,
    }} />,
    { width, height, fonts, headers },
  );
}
