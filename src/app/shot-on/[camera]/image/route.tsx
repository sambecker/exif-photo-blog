import { getPhotosCached } from '@/photo/cache';
import { getCameraFromKey } from '@/camera';
import {
  IMAGE_OG_DIMENSION_SMALL,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/image-response';
import CameraImageResponse from '@/image-response/CameraImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';
import { getImageResponseCacheControlHeaders } from '@/image-response/cache';

export async function GET(
  _: Request,
  context: { params: { camera: string } },
) {
  const camera = getCameraFromKey(context.params.camera);

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
