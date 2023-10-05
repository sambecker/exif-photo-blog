import {
  getPhotosCached,
  getPhotosTagCountCached,
  getPhotosTagDateRangeCached,
} from '@/cache';
import {
  PaginationSearchParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import { pathForTag } from '@/site/paths';

export const getPhotosTagDataCached = ({
  tag,
  limit,
}: {
  tag: string,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ tag, limit }),
    getPhotosTagCountCached(tag),
    getPhotosTagDateRangeCached(tag),
  ]);

export const getPhotosTagDataCachedWithPagination = async ({
  tag,
  limit: limitProp,
  searchParams,
}: {
  tag: string,
  limit?: number,
  searchParams?: PaginationSearchParams,
}) => {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [photos, count, dateRange] =
    await getPhotosTagDataCached({
      tag,
      limit: limitProp ?? limit,
    });

  const showMorePath = count > photos.length
    ? pathForTag(tag, offset + 1)
    : undefined;

  return {
    photos,
    count,
    dateRange,
    showMorePath,
  };
};
