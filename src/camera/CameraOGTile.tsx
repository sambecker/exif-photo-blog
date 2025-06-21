'use client';

import { Photo, PhotoDateRange } from '@/photo';
import { pathForCamera, pathForCameraImage } from '@/app/paths';
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
  dateRange?: PhotoDateRange
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
