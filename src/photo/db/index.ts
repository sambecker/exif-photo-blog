import { PRIORITY_ORDER_ENABLED } from '@/app/config';
import { parameterize } from '@/utility/string';
import { PhotoSetCategory } from '../../category';
import { Camera } from '@/camera';
import { Lens } from '@/lens';

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

export type GetPhotosOptions = {
  sortBy?: 'createdAt' | 'createdAtAsc' | 'takenAt' | 'priority'
  limit?: number
  offset?: number
  query?: string
  maximumAspectRatio?: number
  takenBefore?: Date
  takenAfterInclusive?: Date
  updatedBefore?: Date
  hidden?: 'exclude' | 'include' | 'only'
} & Omit<PhotoSetCategory, 'camera' | 'lens'> & {
  camera?: Partial<Camera>
  lens?: Partial<Lens>
};

export const areOptionsSensitive = (options: GetPhotosOptions) =>
  options.hidden === 'include' || options.hidden === 'only';

export const getWheresFromOptions = (
  options: GetPhotosOptions,
  initialValuesIndex = 1,
) => {
  const {
    hidden = 'exclude',
    takenBefore,
    takenAfterInclusive,
    updatedBefore,
    query,
    maximumAspectRatio,
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

export const getOrderByFromOptions = (options: GetPhotosOptions) => {
  const {
    sortBy = PRIORITY_ORDER_ENABLED ? 'priority' : 'takenAt',
  } = options;

  switch (sortBy) {
  case 'createdAt':
    return 'ORDER BY created_at DESC';
  case 'createdAtAsc':
    return 'ORDER BY created_at ASC';
  case 'takenAt':
    return 'ORDER BY taken_at DESC';
  case 'priority':
    return 'ORDER BY priority_order ASC, taken_at DESC';
  }
};

export const getLimitAndOffsetFromOptions = (
  options: GetPhotosOptions,
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
