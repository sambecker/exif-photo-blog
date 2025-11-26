import { getPhotosCached } from '@/photo/cache';
import { Camera, CameraProps, formatCameraParams } from '@/camera';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import CameraImageResponse from '@/camera/CameraImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getUniqueCameras } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';
import { KEY_PHOTOS } from '@/cache';
import { cacheTag } from 'next/cache';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'cameras',
  'image',
  getUniqueCameras,
  cameras => cameras.map(({ camera }) => formatCameraParams(camera)),
);

async function getCacheComponent(camera: Camera) {
  'use cache';
  cacheTag(KEY_PHOTOS);
  
  const [
    photos,
    { fontFamily, fonts },
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
      camera: camera,
    }),
    getIBMPlexMono(),
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
    { width, height, fonts },
  );
}

export async function GET(
  _: Request,
  context: CameraProps,
) {
  const camera = formatCameraParams(await context.params);

  return getCacheComponent(camera);
}
