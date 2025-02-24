import { MAKE_FUJIFILM } from '@/platforms/fujifilm';
import { Photo } from '.';

export const UPDATED_BEFORE_01 = new Date('2024-06-16');
// UTC 2025-02-24 05:30:00
export const UPDATED_BEFORE_02 = new Date(Date.UTC(2025, 1, 24, 5, 30, 0));

export const isPhotoOutdated = (photo: Photo) => {
  return photo.updatedAt < UPDATED_BEFORE_01 || (
    photo.updatedAt < UPDATED_BEFORE_02 &&
    photo.make === MAKE_FUJIFILM
  );
};
