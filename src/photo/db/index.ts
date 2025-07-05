import { parameterize } from '@/utility/string';
import { PhotoSetCategory } from '../../category';
import { Camera } from '@/camera';
import { Lens } from '@/lens';
import { APP_DEFAULT_SORT_BY, SortBy } from './sort';

export const GENERATE_STATIC_PARAMS_LIMIT = 1000;
export const PHOTO_DEFAULT_LIMIT = 100;

const DB_PARAMETERIZE_REPLACEMENTS = [
  [',', ''],
  ['/', ''],
  ['+', '-'],
  [' ', '-'],
];

const parameterizeForDb = (field: string) =>
  DB_PARAMETERIZE_REPLACEMENTS.reduce((acc, [from, to]) =>
    `REPLACE(${acc}, '${from}', '${to}')`
  , `LOWER(TRIM(${field}))`);

export type PhotoQueryOptions = {
  sortBy?: SortBy
  sortWithPriority?: boolean
  limit?: number
  offset?: number
  query?: string
  maximumAspectRatio?: number
  takenBefore?: Date
  takenAfterInclusive?: Date
  updatedBefore?: Date
  excludeFromFeeds?: boolean
  hidden?: 'exclude' | 'include' | 'only'
} & Omit<PhotoSetCategory, 'camera' | 'lens'> & {
  camera?: Partial<Camera>
  lens?: Partial<Lens>
};

export const areOptionsSensitive = (options: PhotoQueryOptions) =>
  options.hidden === 'include' || options.hidden === 'only';

export const getWheresFromOptions = (
  options: PhotoQueryOptions,
  initialValuesIndex = 1,
) => {
  const {
    hidden = 'exclude',
    excludeFromFeeds,
    takenBefore,
    takenAfterInclusive,
    updatedBefore,
    query,
    maximumAspectRatio,
    recent,
    year,
    tag,
    camera,
    lens,
    film,
    recipe,
    focal,
  } = options;

  const wheres = [] as string[];
  const wheresValues = [] as (string | number)[];
  let valuesIndex = initialValuesIndex;

  switch (hidden) {
  case 'exclude':
    wheres.push('hidden IS NOT TRUE');
    break;
  case 'only':
    wheres.push('hidden IS TRUE');
    break;
  }

  if (excludeFromFeeds) {
    wheres.push('exclude_from_feeds IS NOT TRUE');
  }
  if (takenBefore) {
    wheres.push(`taken_at < $${valuesIndex++}`);
    wheresValues.push(takenBefore.toISOString());
  }
  if (takenAfterInclusive) {
    wheres.push(`taken_at >= $${valuesIndex++}`);
    wheresValues.push(takenAfterInclusive.toISOString());
  }
  if (updatedBefore) {
    wheres.push(`updated_at < $${valuesIndex++}`);
    wheresValues.push(updatedBefore.toISOString());
  }
  if (query) {
    // eslint-disable-next-line max-len
    wheres.push(`CONCAT(title, ' ', caption, ' ', semantic_description) ILIKE $${valuesIndex++}`);
    wheresValues.push(`%${query.toLocaleLowerCase()}%`);
  }
  if (maximumAspectRatio) {
    wheres.push(`aspect_ratio <= $${valuesIndex++}`);
    wheresValues.push(maximumAspectRatio);
  }
  if (recent) {
    // Newest upload must be within past 2 weeks
    // eslint-disable-next-line max-len
    wheres.push('(SELECT MAX(created_at) FROM photos) >= (now() - INTERVAL \'14 days\')');
    // Selects must be within 2 weeks of newest upload
    // eslint-disable-next-line max-len
    wheres.push('created_at >= (SELECT MAX(created_at) - INTERVAL \'14 days\' FROM photos)');
  }
  if (year) {
    wheres.push(`EXTRACT(YEAR FROM taken_at) = $${valuesIndex++}`);
    wheresValues.push(year);
  }
  if (camera?.make) {
    wheres.push(`${parameterizeForDb('make')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(camera.make));
  }
  if (camera?.model) {
    wheres.push(`${parameterizeForDb('model')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(camera.model));
  }
  if (lens?.make) {
    wheres.push(`${parameterizeForDb('lens_make')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(lens.make));
  }
  if (lens?.model) {
    wheres.push(`${parameterizeForDb('lens_model')}=$${valuesIndex++}`);
    // Ensure unique queries for lenses missing makes
    if (!lens.make) { wheres.push('lens_make IS NULL'); }
    wheresValues.push(parameterize(lens.model));
  }
  if (tag) {
    wheres.push(`$${valuesIndex++}=ANY(tags)`);
    wheresValues.push(tag);
  }
  if (film) {
    wheres.push(`film=$${valuesIndex++}`);
    wheresValues.push(film);
  }
  if (recipe) {
    wheres.push(`recipe_title=$${valuesIndex++}`);
    wheresValues.push(recipe);
  }
  if (focal) {
    wheres.push(`focal_length=$${valuesIndex++}`);
    wheresValues.push(focal);
  }

  return {
    wheres: wheres.length > 0
      ? `WHERE ${wheres.join(' AND ')}`
      : '',
    wheresValues,
    lastValuesIndex: valuesIndex,
  };
};

export const getOrderByFromOptions = (options: PhotoQueryOptions) => {
  const {
    sortBy = APP_DEFAULT_SORT_BY,
    sortWithPriority,
  } = options;

  switch (sortBy) {
  case 'takenAt':
    return sortWithPriority
      ? 'ORDER BY priority_order ASC, taken_at DESC'
      : 'ORDER BY taken_at DESC';
  case 'takenAtAsc':
    return sortWithPriority
      ? 'ORDER BY priority_order ASC, taken_at ASC'
      : 'ORDER BY taken_at ASC';
  case 'createdAt':
    return sortWithPriority
      ? 'ORDER BY priority_order ASC, created_at DESC'
      : 'ORDER BY created_at DESC';
  case 'createdAtAsc':
    return sortWithPriority
      ? 'ORDER BY priority_order ASC, created_at ASC'
      : 'ORDER BY created_at ASC';
  }
};

export const getLimitAndOffsetFromOptions = (
  options: PhotoQueryOptions,
  initialValuesIndex = 1,
) => {
  const {
    limit = PHOTO_DEFAULT_LIMIT,
    offset = 0,
  } = options;

  let valuesIndex = initialValuesIndex;

  return {
    limitAndOffset: `LIMIT $${valuesIndex++} OFFSET $${valuesIndex++}`,
    limitAndOffsetValues: [limit, offset],
  };
};
