import { descriptionForPhotoSet, Photo, PhotoDateRange } from '@/photo';
import { AppTextState } from '@/i18n/state';
import {
  absolutePathForRecents,
  absolutePathForRecentsImage,
} from '@/app/path';

export const generateMetaForRecents = (
  photos: Photo[],
  appText: AppTextState,
  count?: number,
  _dateRange?: PhotoDateRange,
) => {
  const title = appText.category.recentTitle;
  const description = descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    undefined,
    count,
  );
  const url = absolutePathForRecents();
  const images = absolutePathForRecentsImage();

  return {
    title,
    description,
    url,
    images,
  };
};
