import { Photo, PhotoDateRange } from '@/photo';
import { absolutePathForCameraImage, pathForCamera } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';
import { Camera } from '.';
import { descriptionForCameraPhotos, titleForCamera } from './meta';

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
  return (
    <OGTile {...{
      title: titleForCamera(camera, photos, count),
      description: descriptionForCameraPhotos(photos, true, count, dateRange),
      path: pathForCamera(camera),
      pathImageAbsolute: absolutePathForCameraImage(camera),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
