import { descriptionForPhotoSet, Photo, PhotoDateRangePostgres } from '@/photo';
import { AppTextState } from '@/i18n/state';
import { absolutePathForYear, absolutePathForYearImage } from '@/app/path';

export const generateMetaForYear = (
  year: string,
  photos: Photo[],
  appText: AppTextState,
  count?: number,
  _dateRange?: PhotoDateRangePostgres,
) => {
  const title = appText.category.yearTitle(year);
  const description = descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    undefined,
    count,
  );
  const url = absolutePathForYear(year);
  const images = absolutePathForYearImage(year);

  return {
    title,
    description,
    url,
    images,
  };
};
