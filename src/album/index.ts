import { absolutePathForAlbum, absolutePathForAlbumImage } from '@/app/path';
import { CategoryQueryMeta } from '@/category';
import { AppTextState } from '@/i18n/state';
import {
  descriptionForPhotoSet,
  Photo,
  PhotoDateRangePostgres,
  photoQuantityText,
} from '@/photo';
import { titleForTag } from '@/tag';

export interface Album {
  id: string
  title: string
  slug: string
  subhead?: string
  description?: string
  locationName?: string
  latitude?: number
  longitude?: number
}

type AlbumWithMeta = {
  album: Album
} & CategoryQueryMeta;

export type Albums = AlbumWithMeta[];

export type AlbumOrAlbumSlug = Album | string;

export const titleForAlbum = (
  album: string,
  photos:Photo[] = [],
  appText: AppTextState,
  explicitCount?: number,
) => [
  album,
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const descriptionForAlbumPhotos = (
  photos: Photo[] = [],
  appText: AppTextState,
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) =>
  descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForAlbum = (
  album: Album,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) => ({
  url: absolutePathForAlbum(album),
  title: titleForTag(album.title, photos, appText, explicitCount),
  description: descriptionForAlbumPhotos(
    photos,
    appText,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForAlbumImage(album),
});
