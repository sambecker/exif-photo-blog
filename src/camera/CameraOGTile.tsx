import { Photo } from '@/photo';
import { absolutePathForCameraImage, pathForCamera } from '@/site/paths';
import OGTile from '@/components/OGTile';
import { Camera } from '.';
import { descriptionForCameraPhotos, titleForCamera } from './meta';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function CameraOGTile({
  camera,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  count,
}: {
  camera: Camera
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  count?: number
}) {
  return (
    <OGTile {...{
      title: titleForCamera(camera, photos, count),
      description: descriptionForCameraPhotos(photos, true, count),
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
