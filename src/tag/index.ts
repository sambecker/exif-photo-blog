import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { capitalizeWords } from '@/utility/string';

export type Tags = {
  tag: string
  count: number
}[]

export const formatTag = (tag?: string) =>
  capitalizeWords(tag?.replaceAll('-', ' '));

export const titleForTag = (
  tag: string,
  photos:Photo[],
  explicitCount?: number,
) => [
  formatTag(tag),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const descriptionForTaggedPhotos = (
  photos: Photo[],
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    'tagged',
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForTag = (
  tag: string,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForTag(tag),
  title: titleForTag(tag, photos, explicitCount),
  description:
    descriptionForTaggedPhotos(photos, true, explicitCount, explicitDateRange),
  images: absolutePathForTagImage(tag),
});
