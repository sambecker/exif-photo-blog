import { getPhotoCached } from '@/photo/cache';
import { IMAGE_OG_DIMENSION } from '@/image-response';
import PhotoImageResponse from '@/image-response/PhotoImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { IS_PRODUCTION, STATICALLY_OPTIMIZED_OG_IMAGES } from '@/site/config';
import { getPhotoIds } from '@/photo/db/query';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { isNextImageReadyBasedOnPhotos } from '@/photo';

export let generateStaticParams:
  (() => Promise<{ photoId: string }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_OG_IMAGES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const photos = await getPhotoIds({ limit: GENERATE_STATIC_PARAMS_LIMIT });
    return photos.map(photoId => ({ photoId }));
  };
}

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
