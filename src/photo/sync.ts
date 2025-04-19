import { MAKE_FUJIFILM } from '@/platforms/fujifilm';
import { Photo } from '.';
import { AI_TEXT_AUTO_GENERATED_FIELDS } from '@/app/config';

export const SYNC_QUERY_LIMIT = 1000;

export const UPDATED_BEFORE_01 = new Date('2024-06-16');
// UTC 2025-02-24 05:30:00
export const UPDATED_BEFORE_02 = new Date(Date.UTC(2025, 1, 24, 5, 30, 0));

const isPhotoOutdated = (photo: Photo) =>
  photo.updatedAt < UPDATED_BEFORE_01 || (
    photo.updatedAt < UPDATED_BEFORE_02 &&
    photo.make === MAKE_FUJIFILM
  );

const doesPhotoNeedAiText = ({
  title,
  caption,
  tags = [],
  semanticDescription,
}: Photo) =>
  (AI_TEXT_AUTO_GENERATED_FIELDS.includes('title') && !title) ||
  (AI_TEXT_AUTO_GENERATED_FIELDS.includes('caption') && !caption) ||
  (AI_TEXT_AUTO_GENERATED_FIELDS.includes('tags') && tags.length === 0) ||
  (AI_TEXT_AUTO_GENERATED_FIELDS.includes('semantic') && !semanticDescription);

export const doesPhotoNeedSync = (photo: Photo) =>
  isPhotoOutdated(photo) ||
  doesPhotoNeedAiText(photo);
