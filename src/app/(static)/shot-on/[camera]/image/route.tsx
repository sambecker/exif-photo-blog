import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import { getCameraFromKey } from '@/camera';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/photo/image-response';
import CameraImageResponse from '@/photo/image-response/CameraImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/og';

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
    getImageCacheHeadersForAuth(await auth()),
  ]);

  const { width, height } = IMAGE_OG_SMALL_SIZE;

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
