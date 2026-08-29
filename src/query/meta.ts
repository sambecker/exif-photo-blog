import { descriptionForPhotoSet, Photo } from '@/photo';
import { AppTextState } from '@/i18n/state';
import { absolutePathForQuery, absolutePathForQueryImage } from '@/app/path';

export const generateMetaForQuery = (
  query: string,
  photos: Photo[],
  appText: AppTextState,
  count?: number,
) => {
  const title = appText.category.queryTitle(query);
  const description = descriptionForPhotoSet(
    photos,
    appText,
    undefined,
    undefined,
    count,
  );
  const url = absolutePathForQuery(query);
  const images = absolutePathForQueryImage(query);

  return {
    title,
    description,
    url,
    images,
  };
};
