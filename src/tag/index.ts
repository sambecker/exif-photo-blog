import {
  Photo,
  PhotoDateRangePostgres,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForTag,
  absolutePathForTagImage,
  getPathComponents,
} from '@/app/path';
import {
  capitalizeWords,
  convertStringToArray,
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';
import { CategoryQueryMeta, sortCategoryByCount } from '@/category';
import { AppTextState } from '@/i18n/state';

// Reserved tags
export const TAG_FAVS   = 'favs';
export const TAG_PRIVATE = 'private';

type TagWithMeta = { tag: string } & CategoryQueryMeta;

export type Tags = TagWithMeta[]

export const formatTag = (tag?: string) =>
  capitalizeWords(tag?.replaceAll('-', ' '));

export const getValidationMessageForTags = (tags?: string) => {
  const reservedTags = (convertStringToArray(tags) ?? [])
    .filter(tag => isTagFavs(tag) || isTagPrivate(tag))
    .map(tag => tag.toLocaleUpperCase());
  return reservedTags.length
    ? `Reserved tags: ${reservedTags.join(', ').toLocaleLowerCase()}`
    : undefined;
};

export const titleForTag = (
  tag: string,
  photos:Photo[] = [],
  appText: AppTextState,
  explicitCount?: number,
) => [
  formatTag(tag),
  photoQuantityText(explicitCount ?? photos.length, appText),
].join(' ');

export const shareTextForTag = (
  tag: string,
  appText: AppTextState,
) =>
  isTagFavs(tag)
    ? appText.category.taggedFavs
    : appText.category.taggedPhrase(formatTag(tag));

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

export const getTopNonFavTags = (tags: Tags) => tags
  .filter(({ tag }) => tag !== TAG_FAVS)
  .slice(0, 3);

export const descriptionForTaggedPhotos = (
  photos: Photo[] = [],
  appText: AppTextState,
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) =>
  descriptionForPhotoSet(
    photos,
    appText,
    appText.category.taggedPhotos,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForTag = (
  tag: string,
  photos: Photo[],
  appText: AppTextState,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRangePostgres,
) => ({
  url: absolutePathForTag(tag),
  title: titleForTag(tag, photos, appText, explicitCount),
  description: descriptionForTaggedPhotos(
    photos,
    appText,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForTagImage(tag),
});

export const deleteTagConfirmationText = (
  tag: string,
  count: number,
  appText: AppTextState,
) =>
  // eslint-disable-next-line max-len
  `Are you sure you want to remove "${formatTag(tag)}" from ${photoQuantityText(count, appText, false, false).toLowerCase()}?`;

export const isTagFavs = (tag: string) => tag.toLocaleLowerCase() === TAG_FAVS;

export const isPhotoFav = ({ tags }: Photo) => tags.some(isTagFavs);

export const isPathFavs = (pathname?: string) =>
  getPathComponents(pathname).tag === TAG_FAVS;

export const isTagPrivate = (tag: string) => tag.toLowerCase() === TAG_PRIVATE;

export const addPrivateToTags = (
  tags: Tags,
  countPrivate = 0,
  lastModifiedPrivate = new Date(),
) =>
  countPrivate > 0
    ? tags
      .filter(({ tag }) => tag === TAG_FAVS)
      .concat({
        tag: TAG_PRIVATE,
        count: countPrivate,
        lastModified: lastModifiedPrivate,
      })
      .concat(tags
        .filter(({ tag }) => tag !== TAG_FAVS)
        .sort(sortCategoryByCount),
      )
    : tags;

export const convertTagsForForm = (
  tags: Tags = [],
  appText: AppTextState,
) =>
  sortTagsObjectWithoutFavs(tags)
    .map(({ tag, count }) => ({
      value: tag,
      annotation: formatCount(count),
      annotationAria:
        formatCountDescriptive(count, appText.category.taggedPhotos),
    }));

export const limitTagsByCount = (
  tags: Tags,
  minimumCount: number,
  queryToInclude?: string,
) =>
  tags.filter(({ tag, count }) => (
    count >= minimumCount ||
    isTagFavs(tag) ||
    isTagPrivate(tag) ||
    (queryToInclude && tag
      .toLocaleLowerCase()
      .includes(queryToInclude.toLocaleLowerCase()))
  ));

export const tagsHaveFavs = (tags: Tags) =>
  tags.some(({ tag }) => isTagFavs(tag));
