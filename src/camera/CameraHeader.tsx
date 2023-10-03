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
}: {
  camera: Camera
  photos: Photo[]
  selectedPhoto?: Photo
}) {
  const camera = cameraFromPhoto(photos[0], cameraProp);
  return (
    <PhotoHeader
      entity={<PhotoCamera {...{ camera }} />}
      entityVerb="Photo"
      entityDescription={descriptionForCameraPhotos(photos)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForCameraShare(camera)}
    />
  );
}
