import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForTag,
  absolutePathForTagImage,
  getPathComponents,
} from '@/app/paths';
import {
  capitalizeWords,
  convertStringToArray,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
import { sortCategoryByCount } from '@/category';

// Reserved tags
export const TAG_FAVS   = 'favs';
export const TAG_HIDDEN = 'hidden';

export type Tags = {
  tag: string
  count: number
}[]

export const formatTag = (tag?: string) =>
  capitalizeWords(tag?.replaceAll('-', ' '));

export const getValidationMessageForTags = (tags?: string) => {
  const reservedTags = (convertStringToArray(tags) ?? [])
    .filter(tag => isTagFavs(tag) || isTagHidden(tag))
    .map(tag => tag.toLocaleUpperCase());
  return reservedTags.length
    ? `Reserved tags: ${reservedTags.join(', ').toLocaleLowerCase()}`
    : undefined;
};

export const titleForTag = (
  tag: string,
  photos:Photo[] = [],
  explicitCount?: number,
) => [
  formatTag(tag),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextForTag = (tag: string) =>
  isTagFavs(tag) ? 'Favorite photos' : `Photos tagged '${formatTag(tag)}'`;

export const sortTagsArray = (
  tags: string[],
  tagToExclude?: string,
) => tags
  .filter(tag => tag !== tagToExclude)
  .sort((a, b) => isTagFavs(a) ? -1 : a.localeCompare(b));

export const sortTags = (
  tags: Tags,
  tagToExclude?: string,
) => tags
  .filter(({ tag }) => tag!== tagToExclude)
  .sort(({ tag: a }, { tag: b }) =>
    isTagFavs(a)
      ? -1
      : isTagFavs(b)
        ? 1
        : a.localeCompare(b));

export const sortTagsByCount = (
  tags: Tags,
  tagToExclude?: string,
) => tags
  .filter(({ tag }) => tag !== tagToExclude)
  .sort(({ tag: tagA, count: countA }, { tag: tagB, count: countB }) =>
    isTagFavs(tagA)
      ? -1
      : isTagFavs(tagB)
        ? 1
        : countB - countA);

export const sortTagsWithoutFavs = (tags: string[]) =>
  sortTagsArray(tags, TAG_FAVS);

export const sortTagsObjectWithoutFavs = (tags: Tags) =>
  sortTags(tags, TAG_FAVS);

export const descriptionForTaggedPhotos = (
  photos: Photo[] = [],
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

export const isTagFavs = (tag: string) => tag.toLocaleLowerCase() === TAG_FAVS;

export const isPhotoFav = ({ tags }: Photo) => tags.some(isTagFavs);

export const isPathFavs = (pathname?: string) =>
  getPathComponents(pathname).tag === TAG_FAVS;

export const isTagHidden = (tag: string) => tag.toLowerCase() === TAG_HIDDEN;

export const addHiddenToTags = (tags: Tags, photosCountHidden = 0) =>
  photosCountHidden > 0
    ? tags
      .filter(({ tag }) => tag === TAG_FAVS)
      .concat({ tag: TAG_HIDDEN, count: photosCountHidden })
      .concat(tags
        .filter(({ tag }) => tag !== TAG_FAVS)
        .sort(sortCategoryByCount),
      )
    : tags;

export const convertTagsForForm = (tags: Tags = []) =>
  sortTagsObjectWithoutFavs(tags)
    .map(({ tag, count }) => ({
      value: tag,
      annotation: formatCount(count),
      annotationAria: formatCountDescriptive(count, 'tagged'),
    }));
