import { CategoryKey } from '.';
import {
  CATEGORY_VISIBILITY,
  IS_BUILDING,
  IS_PRODUCTION,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORIES,
  STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES,
} from '@/app/config';
import { GENERATE_STATIC_PARAMS_LIMIT } from '@/photo/db';
import { pluralize } from '@/utility/string';

type StaticOutput = 'page' | 'image';

export const shouldGenerateStaticParamsForCategory = (
  key: CategoryKey,
  type: StaticOutput,
): boolean =>
  CATEGORY_VISIBILITY.includes(key) &&
  IS_PRODUCTION && (
    (type === 'page' && STATICALLY_OPTIMIZED_PHOTO_CATEGORIES) ||
    (type === 'image' && STATICALLY_OPTIMIZED_PHOTO_CATEGORY_OG_IMAGES)
  );

export const staticallyGenerateCategory = async <T, K>(
  key: CategoryKey,
  type: StaticOutput,
  getData: () => Promise<T[]>,
  formatData: (data: T[]) => K[],
): Promise<K[]> => {
  const data = (await getData()).slice(0, GENERATE_STATIC_PARAMS_LIMIT);

  if (IS_BUILDING) {
    console.log(
      `Statically generating ${key} (${pluralize(data.length, type)})`,
    );
  }

  return formatData(data);
};
