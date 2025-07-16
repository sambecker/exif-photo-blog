'use client';

import {
  Photo,
  descriptionForPhoto,
  titleForPhoto,
} from '@/photo';
import { PhotoSetCategory } from '../category';
import { pathForPhoto, pathForPhotoImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';

export default function PhotoOGTile({
  photo,
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
      riseOnHover,
      retryTime,
      onVisible,
    }} />
  );
};
