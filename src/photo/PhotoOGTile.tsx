'use client';

import {
  Photo,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import { pathForPhoto, pathForPhotoImage } from '@/app/paths';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';

export default function PhotoOGTile({
  photo,
  onLoad,
  onFail,
  riseOnHover,
  retryTime,
  onVisible,
  ...categories
}: {
  photo: Photo
} & PhotoSetCategory & OGTilePropsCore) {
  return (
    <OGTile {...{
      title: titleForPhoto(photo),
      description: descriptionForPhoto(photo),
      path: pathForPhoto({ photo, ...categories }),
      pathImage: pathForPhotoImage(photo),
      onLoad,
      onFail,
      riseOnHover,
      retryTime,
      onVisible,
    }} />
  );
};
