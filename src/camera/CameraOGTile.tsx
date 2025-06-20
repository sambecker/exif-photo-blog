'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { pathForCamera, pathForCameraImage } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/og/OGTile';
import { Camera } from '.';
import { descriptionForCameraPhotos, titleForCamera } from './meta';
import { useAppText } from '@/i18n/state/client';

export default function CameraOGTile({
  camera,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
  dateRange,
}: {
  camera: Camera
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const appText = useAppText();
  return (
    <OGTile {...{
      title: titleForCamera(camera, photos, appText, count),
      description: descriptionForCameraPhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForCamera(camera),
      pathImage: pathForCameraImage(camera),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
