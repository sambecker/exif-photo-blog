import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { capitalizeWords, convertStringToArray } from '@/utility/string';

export const TAG_FAVS = 'favs';

export type Tags = {
  tag: string
  count: number
}[]

export const formatTag = (tag?: string) =>
  capitalizeWords(tag?.replaceAll('-', ' '));

export const doesTagsStringIncludeFavs = (tags?: string) =>
  convertStringToArray(tags)?.some(tag => isTagFavs(tag));

export const titleForTag = (
  tag: string,
  photos:Photo[],
  explicitCount?: number,
) => [
  formatTag(tag),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const sortTags = (
  tags: string[],
  tagToHide?: string,
) => tags
  .filter(tag => tag !== tagToHide)
  .sort((a, b) => isTagFavs(a) ? -1 : a.localeCompare(b));

export const sortTagsObject = (
  tags: Tags,
  tagToHide?: string,
) => tags
  .filter(({ tag }) => tag!== tagToHide)
  .sort(({ tag: a }, { tag: b }) => isTagFavs(a) ? -1 : a.localeCompare(b));

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

export const isTagFavs = (tag: string) => tag.toLowerCase() === TAG_FAVS;
