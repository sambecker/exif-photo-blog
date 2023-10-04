import { Photo, descriptionForPhotoSet, photoQuantityText } from '@/photo';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { capitalizeWords } from '@/utility/string';

export const titleForTag = (
  tag: string,
  photos:Photo[],
  explicitCount?: number,
) => [
  capitalizeWords(tag.replaceAll('-', ' ')),
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const descriptionForTaggedPhotos = (
  photos: Photo[],
  dateBased?: boolean,
  explicitCount?: number,
) =>
  descriptionForPhotoSet(photos, 'tagged', dateBased, explicitCount);

export const generateMetaForTag = (
  tag: string,
  photos: Photo[],
  explicitCount?: number,
) => ({
  url: absolutePathForTag(tag),
  title: titleForTag(tag, photos, explicitCount),
  description: descriptionForTaggedPhotos(photos, true),
  images: absolutePathForTagImage(tag),
});
