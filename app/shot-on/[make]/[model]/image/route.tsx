import { CameraProps, formatCameraParams } from '@/camera';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response/size';
import CameraImageResponse from '@/camera/CameraImageResponse';
import { cachedOgPhotoResponse } from '@/image-response/photo';

export async function GET(
  _: Request,
  context: CameraProps,
) {
  const camera = formatCameraParams(await context.params);

  return cachedOgPhotoResponse(
    { camera },
    { camera, limit: MAX_PHOTOS_TO_SHOW_PER_CATEGORY },
    args => <CameraImageResponse {...{ camera, ...args }} />,
  );
}
