'use client';

import {
  Photo,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import { absolutePathForPhotoImage, pathForPhoto } from '@/app/paths';
import OGTile, { OGLoadingState } from '@/components/OGTile';

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
      pathImageAbsolute: absolutePathForPhotoImage(photo),
      loadingState: loadingStateExternal,
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
      onVisible,
    }} />
  );
};
