import { PRIORITY_ORDER_ENABLED } from '@/app-core/config';
import { parameterize } from '@/utility/string';
import { PhotoSetCategory } from '..';

export const GENERATE_STATIC_PARAMS_LIMIT = 1000;
export const PHOTO_DEFAULT_LIMIT = 100;

// Trim whitespace
// Make lowercase
// Replace spaces with dashes
// Remove periods and commas
const parameterizeForDb = (text: string) =>
  `REPLACE(REPLACE(REPLACE(LOWER(TRIM(${text})), '.', ''), ',', ''), ' ', '-')`;

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
} & PhotoSetCategory;

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
    simulation,
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
  if (tag) {
    wheres.push(`$${valuesIndex++}=ANY(tags)`);
    wheresValues.push(tag);
  }
  if (camera) {
    wheres.push(`${parameterizeForDb('make')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(camera.make, true));
    wheres.push(`${parameterizeForDb('model')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(camera.model, true));
  }
  if (lens) {
    wheres.push(`${parameterizeForDb('lens_make')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(lens.make, true));
    wheres.push(`${parameterizeForDb('lens_model')}=$${valuesIndex++}`);
    wheresValues.push(parameterize(lens.model, true));
  }
  if (simulation) {
    wheres.push(`film_simulation=$${valuesIndex++}`);
    wheresValues.push(simulation);
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
