'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import PhotoHeader from '@/photo/PhotoHeader';
import { Camera, cameraFromPhoto } from '.';
import PhotoCamera from './PhotoCamera';
import { descriptionForCameraPhotos } from './meta';
import { AI_CONTENT_GENERATION_ENABLED } from '@/app/config';
import { useAppText } from '@/i18n/state/client';

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
  dateRange?: PhotoDateRangePostgres
}) {
  const appText = useAppText();
  const camera = cameraFromPhoto(photos[0], cameraProp);

  return (
    <PhotoHeader
      camera={camera}
      entity={<PhotoCamera
        {...{ camera }}
        contrast="high"
        hoverType="none"
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
      hasAiTextGeneration={AI_CONTENT_GENERATION_ENABLED}
      includeShareButton
    />
  );
}
