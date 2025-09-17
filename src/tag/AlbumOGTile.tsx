'use client';

import { Photo, PhotoDateRangePostgres } from '@/photo';
import { pathForAlbum, pathForAlbumImage } from '@/app/path';
import OGTile, { OGTilePropsCore } from '@/components/og/OGTile';
import { useAppText } from '@/i18n/state/client';
import { Album, descriptionForAlbumPhotos, titleForAlbum } from '@/album';

export default function AlbumOGTile({
  album,
  photos,
  count,
  dateRange,
  ...props
}: {
  album: Album
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRangePostgres
} & OGTilePropsCore) {
  const appText = useAppText();
  return (
    <OGTile {...{
      ...props,
      title: titleForAlbum(album, photos, appText, count),
      description: descriptionForAlbumPhotos(
        photos,
        appText,
        true,
        count,
        dateRange,
      ),
      path: pathForAlbum(album),
      pathImage: pathForAlbumImage(album),
    }}/>
  );
};
