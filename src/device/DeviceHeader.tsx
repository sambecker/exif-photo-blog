import { Photo } from '@/photo';
import { pathForDeviceShare } from '@/site/paths';
import PhotoHeader from '@/photo/PhotoHeader';
import { Device, formatDevice } from '.';
import PhotoDevice from './PhotoDevice';
import { descriptionForDevicePhotos } from './meta';

export default function DeviceHeader({
  device: deviceFromProps,
  photos,
  selectedPhoto,
}: {
  device: Device
  photos: Photo[]
  selectedPhoto?: Photo
}) {
  const device = formatDevice(deviceFromProps, photos[0]);
  return (
    <PhotoHeader
      entity={<PhotoDevice {...{ device }} />}
      entityVerb="Device"
      entityDescription={descriptionForDevicePhotos(photos)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForDeviceShare(device)}
    />
  );
}
