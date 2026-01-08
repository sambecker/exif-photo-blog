import { CategoryKey } from '../category';
import {
  CATEGORY_VISIBILITY,
  IS_BUILDING,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORIES,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  STATICALLY_OPTIMIZED_PHOTO_OG_IMAGES,
  STATICALLY_OPTIMIZED_PHOTOS,
} from '@/app/config';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/db';
import { getPublicPhotoIds } from '@/photo/query';
import { depluralize, pluralize } from '@/utility/string';

type StaticOutput = 'page' | 'image';

// Null response necessary to satisfy 'use cache' restriction requiring
// at least one param from generateStaticParams
const NULL_PARAMS = [{}];
type NullParams = typeof NULL_PARAMS;

const logStaticGenerationDetails = (count: number, content: string) => {
  if (count > 0) {
    const label = pluralize(count, content, undefined, 3);
    console.log(`>  Statically generating ${label} ...`);
  }
};

export const staticallyGeneratePhotosIfConfigured = async (
  type: StaticOutput,
): Promise<{ photoId: string }[] | NullParams> => {
  let params: { photoId: string }[] = [];

  if (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTOS) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_OG_IMAGES)
  ) {
    const photoIds = await getPublicPhotoIds({
      limit: GENERATE_STATIC_PARAMS_LIMIT,
    })
      .catch(e => {
        console.error(`Error fetching static photo data: ${e}`);
        return [];
      });
    if (IS_BUILDING) {
      logStaticGenerationDetails(photoIds.length, `photo ${type}`);
    }
    params = photoIds.map(photoId => ({ photoId }));
  }

  return params.length > 0 ? params : NULL_PARAMS;
};

export const staticallyGenerateCategoryIfConfigured = async <T, K>(
  key: CategoryKey,
  type: StaticOutput,
  getData: () => Promise<T[]>,
  formatData: (data: T[]) => K[],
): Promise<K[] | NullParams> => {
  let params: K[] = [];

  if (CATEGORY_VISIBILITY.includes(key) && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTO_CATEGORIES) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES)
  )) {
    const data = (await getData()
      .catch(e => {
        console.error(`Error fetching static ${key} data: ${e}`);
        return [];
      }))
      .slice(0, GENERATE_STATIC_PARAMS_LIMIT);
    if (IS_BUILDING) {
      logStaticGenerationDetails(
        data.length,
        `${depluralize(key)} ${type}`,
      );
    }
    params = formatData(data);
  }

  return params.length > 0 ? params : NULL_PARAMS;
};
