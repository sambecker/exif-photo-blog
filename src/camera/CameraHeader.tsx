import { Photo } from '@/photo';
import { pathForCameraShare } from '@/site/paths';
import PhotoHeader from '@/photo/PhotoHeader';
import { Camera, cameraFromPhoto } from '.';
import PhotoCamera from './PhotoCamera';
import { descriptionForCameraPhotos } from './meta';

export default function CameraHeader({
  camera: cameraProp,
  photos,
  selectedPhoto,
  count,
}: {
  camera: Camera
  photos: Photo[]
  selectedPhoto?: Photo
  count?: number
}) {
  const camera = cameraFromPhoto(photos[0], cameraProp);
  return (
    <PhotoHeader
      entity={<PhotoCamera {...{ camera }} />}
      entityVerb="Photo"
      entityDescription={descriptionForCameraPhotos(photos, undefined, count)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForCameraShare(camera)}
      count={count}
    />
  );
}
