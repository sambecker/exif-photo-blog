import { Photo, PhotoDateRange } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { Camera, cameraFromPhoto } from '.';
import PhotoCamera from './PhotoCamera';
import { descriptionForCameraPhotos } from './meta';
import { AI_TEXT_GENERATION_ENABLED } from '@/app/config';
import { getAppText } from '@/i18n/state/server';

export default async function CameraHeader({
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
  const appText = await getAppText();
  const camera = cameraFromPhoto(photos[0], cameraProp);

  return (
    <PhotoHeader
      camera={camera}
      entity={<PhotoCamera
        {...{ camera }}
        contrast="high"
        showHover={false}
      />}
      entityDescription={
        descriptionForCameraPhotos(
          photos,
          appText,
          undefined,
          count,
          dateRange,
        )}
      photos={photos}
      selectedPhoto={selectedPhoto}
      indexNumber={indexNumber}
      count={count}
      dateRange={dateRange}
      hasAiTextGeneration={AI_TEXT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
