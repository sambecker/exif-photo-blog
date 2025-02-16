import { getPhotosCached } from '@/photo/cache';
import { Camera, CameraProps, getCameraFromParams } from '@/camera';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/image-response';
import CameraImageResponse from '@/image-response/CameraImageResponse';
import { getIBMPlexMonoMedium } from '@/app-core/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueCameras } from '@/photo/db/query';
import {
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  IS_PRODUCTION,
} from '@/app-core/config';

export let generateStaticParams:
  (() => Promise<{ camera: Camera }[]>) | undefined = undefined;

if (STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES && IS_PRODUCTION) {
  generateStaticParams = async () => {
    const cameras = await getUniqueCameras();
    return cameras
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT)
      .map(({ camera }) => ({ camera }));
  };
}

export async function GET(
  _: Request,
  context: CameraProps,
) {
  const camera = getCameraFromParams(await context.params);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_TAG,
      camera: camera,
    }),
    getIBMPlexMonoMedium(),
    getImageResponseCacheControlHeaders(),
  ]);

  const { width, height } = IMAGE_OG_DIMENSION_SMALL;

  return new ImageResponse(
    <CameraImageResponse {...{
      camera,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
