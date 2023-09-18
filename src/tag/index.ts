import { Photo, dateRangeForPhotos } from '@/photo';
import { capitalizeWords } from '@/utility/string';

export const titleForTag = (tag: string, photos:Photo[]) =>
  `${capitalizeWords(tag.replaceAll('-', ' '))} (${photos.length})`;

export const descriptionForTaggedPhotos = (
  photos:Photo[],
  dateBased?: boolean,
) =>
  dateBased
    ? dateRangeForPhotos(photos).description.toUpperCase()
    : `${photos.length} tagged ${photos.length === 1 ? 'photo' : 'photos'}`;
