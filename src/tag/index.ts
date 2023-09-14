import { Photo } from '@/photo';
import { capitalizeWords } from '@/utility/string';

export const pageTitleForTag = (tag: string) =>
  `${capitalizeWords(tag.replaceAll('-', ' '))} Photos`;

export const ogTitleForTag = (tag: string) =>
  `🏷️ ${capitalizeWords(tag.replaceAll('-', ' '))}`;

export const descriptionForTaggedPhotos = (photos:Photo[]) =>
  `${photos.length} tagged ${photos.length === 1 ? 'photo' : 'photos'}`;
