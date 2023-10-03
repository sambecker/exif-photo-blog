import { auth } from '@/auth';
import { getImageCacheHeadersForAuth, getPhotosCached } from '@/cache';
import { getMakeModelFromDeviceString } from '@/device';
import {
  IMAGE_OG_SMALL_SIZE,
  MAX_PHOTOS_TO_SHOW_PER_TAG,
} from '@/photo/image-response';
import DeviceImageResponse from '@/photo/image-response/DeviceImageResponse';
import { getIBMPlexMonoMedium } from '@/site/font';
import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(
  _: Request,
  context: { params: { device: string } },
) {
  const device = getMakeModelFromDeviceString(context.params.device);

  const [
    photos,
    { fontFamily, fonts },
    headers,
  ] = await Promise.all([
    getPhotosCached({
      limit: MAX_PHOTOS_TO_SHOW_PER_TAG,
      device,
    }),
    getIBMPlexMonoMedium(),
    getImageCacheHeadersForAuth(await auth()),
  ]);

  const { width, height } = IMAGE_OG_SMALL_SIZE;

  return new ImageResponse(
    <DeviceImageResponse {...{
      device,
      photos,
      width,
      height,
      fontFamily,
    }}/>,
    { width, height, fonts, headers },
  );
}
