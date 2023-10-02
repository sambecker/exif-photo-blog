import { Photo } from '@/photo';
import { pathForTagShare } from '@/site/paths';
import PhotoHeader from '@/photo/PhotoHeader';
import { descriptionForDevicePhotos, getMakeModelFromDevice } from '.';
import PhotoDevice from './PhotoDevice';

export default function DeviceHeader({
  device,
  photos,
  selectedPhoto,
}: {
  device: string
  photos: Photo[]
  selectedPhoto?: Photo
}) {
  return (
    <PhotoHeader
      entity={<PhotoDevice {...getMakeModelFromDevice(device)} />}
      entityVerb="Device"
      entityDescription={descriptionForDevicePhotos(photos)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForTagShare(device)}
    />
  );
}
