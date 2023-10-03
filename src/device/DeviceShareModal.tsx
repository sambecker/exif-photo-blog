import { absolutePathForDevice, pathForDevice } from '@/site/paths';
import { Photo } from '../photo';
import ShareModal from '@/components/ShareModal';
import DeviceOGTile from './DeviceOGTile';
import { Device } from '.';

export default function DeviceShareModal({
  device,
  photos,
}: {
  device: Device
  photos: Photo[]
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForDevice(device)}
      pathClose={pathForDevice(device)}
    >
      <DeviceOGTile {...{ device, photos }} />
    </ShareModal>
  );
};
