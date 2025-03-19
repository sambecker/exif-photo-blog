import { CategoryKey } from '../category';
import {
  CATEGORY_VISIBILITY,
  IS_BUILDING,
  IS_PRODUCTION,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORIES,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
} from '@/app/config';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { getPhotoIds } from '@/photo/db/query';
import { depluralize, pluralize } from '@/utility/string';

type StaticOutput = 'page' | 'image';

const logStaticGenerationDetails = (count: number, content: string) => {
  const label = pluralize(count, content, undefined, 3);
  console.log(`Statically generating ${label} ...`);
};

export const staticallyGeneratePhotosIfConfigured = (type: StaticOutput) =>
  IS_PRODUCTION && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTO_CATEGORIES) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES)
  )
    ? async () => {
      const photos = await getPhotoIds({ limit: GENERATE_STATIC_PARAMS_LIMIT });
      if (IS_BUILDING) {
        logStaticGenerationDetails(photos.length, `photo ${type}`);
      }
      return photos.map(photoId => ({ photoId }));
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
        const data = (await getData()).slice(0, GENERATE_STATIC_PARAMS_LIMIT);
        if (IS_BUILDING) {
          logStaticGenerationDetails(
            data.length,
            `${depluralize(key)} ${type}`,
          );
        }
        return formatData(data);
      }
      : undefined;
