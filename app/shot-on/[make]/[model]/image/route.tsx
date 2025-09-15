import { getPhotosCached } from '@/photo/cache';
import { CameraProps, formatCameraParams } from '@/camera';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';
import CameraImageResponse from '@/camera/CameraImageResponse';
import { getIBMPlexMono } from '@/app/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';
import { getUniqueCameras } from '@/photo/query';
import { staticallyGenerateCategoryIfConfigured } from '@/app/static';

export const generateStaticParams = staticallyGenerateCategoryIfConfigured(
  'cameras',
  'image',
  getUniqueCameras,
  cameras => cameras.map(({ camera }) => formatCameraParams(camera)),
);

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
