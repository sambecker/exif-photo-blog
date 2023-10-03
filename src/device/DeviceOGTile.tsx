import { Photo } from '@/photo';
import { absolutePathForDeviceImage, pathForDevice } from '@/site/paths';
import OGTile from '@/components/OGTile';
import { Device, titleForDevice } from '.';
import { descriptionForDevicePhotos } from './meta';

export type OGLoadingState = 'unloaded' | 'loading' | 'loaded' | 'failed';

export default function DeviceOGTile({
  device,
  photos,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
}: {
  device: Device
  photos: Photo[]
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
}) {
  return (
    <OGTile {...{
      title: titleForDevice(device, photos),
      description: descriptionForDevicePhotos(photos, true),
      path: pathForDevice(device),
      pathImageAbsolute: absolutePathForDeviceImage(device),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
    }}/>
  );
};
