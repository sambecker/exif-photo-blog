import { absolutePathForAlbum, absolutePathForAlbumImage } from '@/app/path';
import { CategoryQueryMeta } from '@/category';
import { AppTextState } from '@/i18n/state';
import {
  descriptionForPhotoSet,
  Photo,
  PhotoDateRangePostgres,
  photoQuantityText,
} from '@/photo';
import camelcaseKeys from 'camelcase-keys';

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

export const parseAlbumFromDb = (album: any): Album =>
  camelcaseKeys(album);

export const titleForAlbum = (
  album: Album,
  photos:Photo[] = [],
  appText: AppTextState,
  explicitCount?: number,
) => [
  album.title,
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextForAlbum = (
  album: Album,
  appText: AppTextState,
) => [
  `${appText.category.album}:`,
  album.title,
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
  title: titleForAlbum(album, photos, appText, explicitCount),
  description: descriptionForAlbumPhotos(
    photos,
    appText,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForAlbumImage(album),
});
