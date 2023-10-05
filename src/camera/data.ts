import { 
  PaginationSearchParams,
  getPaginationForSearchParams,
} from '@/site/pagination';
import { Camera } from '.';
import {
  getPhotosCached,
  getPhotosCameraCountCached,
  getPhotosCameraDateRangeCached,
} from '@/cache';
import { pathForCamera } from '@/site/paths';

export const getPhotosCameraDataCached = ({
  camera,
  limit,
}: {
  camera: Camera,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ camera, limit }),
    getPhotosCameraCountCached(camera),
    getPhotosCameraDateRangeCached(camera),
  ]);

export const getPhotosCameraDataCachedWithPagination = async ({
  camera,
  limit: limitProp,
  searchParams,
}: {
  camera: Camera,
  limit?: number,
  searchParams?: PaginationSearchParams,
}) => {
  const { offset, limit } = getPaginationForSearchParams(searchParams);

  const [photos, count, dateRange] =
    await getPhotosCameraDataCached({
      camera,
      limit: limitProp ?? limit,
    });

  const showMorePath = count > photos.length
    ? pathForCamera(camera, offset + 1)
    : undefined;

  return {
    photos,
    count,
    dateRange,
    showMorePath,
  };
};
