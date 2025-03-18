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
import { getUniqueCameras } from '@/photo/db/query';
import {
  shouldGenerateStaticParamsForCategory,
  staticallyGenerateCategory,
} from '@/category/server';

export let generateStaticParams:
  (() => Promise<Camera[]>) | undefined = undefined;

if (shouldGenerateStaticParamsForCategory('cameras', 'image')) {
  generateStaticParams = () =>
    staticallyGenerateCategory(
      'cameras',
      'image',
      getUniqueCameras,
      cameras => cameras.map(({ camera }) => camera),
    );
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
