import { CategoryKey } from '../category';
import {
  CATEGORY_VISIBILITY,
  IS_BUILDING,
  IS_PRODUCTION,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORIES,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
  STATICALLY_OPTIMIZED_PHOTO_OG_IMAGES,
  STATICALLY_OPTIMIZED_PHOTOS,
} from '@/app/config';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/db';
import { getPublicPhotoIds } from '@/photo/query';
import { depluralize, pluralize } from '@/utility/string';

type StaticOutput = 'page' | 'image';

const logStaticGenerationDetails = (count: number, content: string) => {
  if (count > 0) {
    const label = pluralize(count, content, undefined, 3);
    console.log(`>  Statically generating ${label} ...`);
  }
};

export const staticallyGeneratePhotosIfConfigured = (type: StaticOutput) =>
  IS_PRODUCTION && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTOS) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_OG_IMAGES)
  )
    ? async () => {
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
      return photoIds.map(photoId => ({ photoId }));
    }
    : undefined;

export const staticallyGenerateCategoryIfConfigured = <T, K>(
  key: CategoryKey,
  type: StaticOutput,
  getData: () => Promise<T[]>,
  formatData: (data: T[]) => K[],
): (() => Promise<K[]>) | undefined =>
  CATEGORY_VISIBILITY.includes(key) &&
  IS_PRODUCTION && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTO_CATEGORIES) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES)
  )
    ? async () => {
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
      return formatData(data);
    }
    : undefined;
