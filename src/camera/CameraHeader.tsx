import { Photo, PhotoDateRange } from '@/photo';
import { pathForCameraShare } from '@/site/paths';
import PhotoSetHeader from '@/photo/PhotoSetHeader';
import { Camera, cameraFromPhoto } from '.';
import PhotoCamera from './PhotoCamera';
import { descriptionForCameraPhotos } from './meta';

export default function CameraHeader({
  camera: cameraProp,
  photos,
  selectedPhoto,
  indexNumber,
  count,
  dateRange,
}: {
  camera: Camera
  photos: Photo[]
  selectedPhoto?: Photo
  indexNumber?: number
  count?: number
  dateRange?: PhotoDateRange
}) {
  const camera = cameraFromPhoto(photos[0], cameraProp);
  return (
    <PhotoSetHeader
      entity={<PhotoCamera {...{ camera }} contrast="high" hideAppleIcon />}
      entityVerb="Photo"
      entityDescription={
        descriptionForCameraPhotos(photos, undefined, count, dateRange)}
      photos={photos}
      selectedPhoto={selectedPhoto}
      sharePath={pathForCameraShare(camera)}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
    />
  );
}
