'use client';

import {
  Photo,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import { pathForPhoto, pathForPhotoImage } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/og/OGTile';

export default function PhotoOGTile({
  photo,
  loadingState: loadingStateExternal,
  riseOnHover,
  onLoad,
  onFail,
  retryTime,
  onVisible,
  ...categories
}: {
  photo: Photo
  loadingState?: OGLoadingState
  onLoad?: () => void
  onFail?: () => void
  riseOnHover?: boolean
  retryTime?: number
  onVisible?: () => void
} & PhotoSetCategory) {
  return (
    <OGTile {...{
      title: titleForPhoto(photo),
      description: descriptionForPhoto(photo),
      path: pathForPhoto({ photo, ...categories }),
      pathImage: pathForPhotoImage(photo),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
      onVisible,
    }} />
  );
};
