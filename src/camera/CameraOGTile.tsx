'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import { pathForCamera, pathForCameraImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { Camera } from '.';
import { descriptionForCameraPhotos, titleForCamera } from './meta';
import { useAppText } from '@/i18n/state/client';

export default function CameraOGTile({
  camera,
  photos,
  count,
  dateRange,
  ...props
}: {
  camera: Camera
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: titleForCamera(camera, photos, appText, count),
      description:
        descriptionForCameraPhotos(
          photos,
          appText,
          true,
          count,
          dateRange,
        ),
      path: pathForCamera(camera),
      pathImage: pathForCameraImage(camera),
    }}/>
  );
};
