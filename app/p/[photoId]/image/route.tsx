import { getPhotoCached } from '@/photo/cache';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import PhotoImageResponse from '@/photo/PhotoImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { staticallyGeneratePhotosIfConfigured } from '@/app/static';
import { safePhotoImageResponse } from '@/platforms/safe-photo-image-response';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = async () =>
  staticallyGeneratePhotosIfConfigured(
    'image',
  );

async function getCacheComponent(photoId: string) {
  'use cache';
  cacheTag(KEY_PHOTOS);
  
  const [
    photo,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotoCached(photoId),
    getIBMPlexMono(),
  ]);
  
  if (!photo) { return new Response('Photo not found', { status: 404 }); }

  const { width, height } = IMAGE_OG_DIMENSION;
  
  return safePhotoImageResponse(
    [photo],
    isNextImageReady => (
      <PhotoImageResponse {...{
        photo,
        width,
        height,
        fontFamily,
        isNextImageReady,
      }} />
    ),
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: { params: Promise<{ photoId: string }> },
) {
  const { photoId } = await context.params;

  return getCacheComponent(photoId);
}
