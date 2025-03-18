import { getPhotosCached } from '@/photo/cache';
import { Camera, CameraProps, formatCameraParams } from '@/camera';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import CameraImageResponse from '@/image-response/CameraImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getUniqueCameras } from '@/photo/db/query';
import { shouldGenerateStaticParamsForCategory } from '@/category/set';

export let generateStaticParams:
  (() => Promise<{ camera: Camera }[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('cameras', 'image')) {
  generateStaticParams = async () => {
    const cameras = await getUniqueCameras();
    return cameras
      .map(({ camera }) => ({ camera }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
  };
}

export async function GET(
  _: Request,
  context: CameraProps,
) {
  const camera = formatCameraParams(await context.params);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      camera: camera,
    }),
    getIBMPlexMono(),
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
