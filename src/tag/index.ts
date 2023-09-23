import { Photo, dateRangeForPhotos } from '@/photo';
import { absolutePathForTag, absolutePathForTagImage } from '@/site/paths';
import { capitalizeWords } from '@/utility/string';

const labelForPhotos = (photos: Photo[]) =>
  photos.length === 1 ? 'Photo' : 'Photos';

export const titleForTag = (tag: string, photos:Photo[]) => [
  capitalizeWords(tag.replaceAll('-', ' ')),
  `(${photos.length} ${labelForPhotos(photos)})`,
].join(' ');

export const descriptionForTaggedPhotos = (
  photos:Photo[],
  dateBased?: boolean,
) =>
  dateBased
    ? dateRangeForPhotos(photos).description.toUpperCase()
    : `${photos.length} Tagged ${labelForPhotos(photos)}`;

export const generateMetaForTag = (tag: string, photos: Photo[]) => ({
  url: absolutePathForTag(tag),
  title: titleForTag(tag, photos),
  description: descriptionForTaggedPhotos(photos, true),
  images: absolutePathForTagImage(tag),
});
