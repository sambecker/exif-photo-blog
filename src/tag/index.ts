import { Photo, descriptionForPhotoSet, photoQuantityText } from '@/photo';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { capitalizeWords } from '@/utility/string';

export const titleForTag = (tag: string, photos:Photo[]) => [
  capitalizeWords(tag.replaceAll('-', ' ')),
  photoQuantityText(photos),
].join(' ');

export const descriptionForTaggedPhotos = (
  photos: Photo[],
  dateBased?: boolean,
) =>
  descriptionForPhotoSet(photos, 'tagged', dateBased);

export const generateMetaForTag = (tag: string, photos: Photo[]) => ({
  url: absolutePathForTag(tag),
  title: titleForTag(tag, photos),
  description: descriptionForTaggedPhotos(photos, true),
  images: absolutePathForTagImage(tag),
});
