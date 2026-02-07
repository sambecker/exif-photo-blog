import { parameterize } from '@/utility/string';
import { PhotoSetCategory } from '@/category';
import { Camera } from '@/camera';
import { Lens } from '@/lens';
import { APP_DEFAULT_SORT_BY, SortBy } from '@/photo/sort';
import { Album } from '@/album';

export const GENERATE_STATIC_PARAMS_LIMIT = 1000;
export const PHOTO_DEFAULT_LIMIT = 100;

// These must mirror utility/string.ts parameterization
const CHARACTERS_TO_REMOVE = [',', '/'];
const CHARACTERS_TO_REPLACE = ['+', '&', '|', ':', '_', ' '];

const parameterizeForDb = (field: string) =>
  `REGEXP_REPLACE(
    REGEXP_REPLACE(
      LOWER(TRIM(${field})),
      '[${CHARACTERS_TO_REMOVE.join('')}]', '', 'g'
    ),
    '[${CHARACTERS_TO_REPLACE.join('')}]', '-', 'g'
  )`;

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
} & Omit<PhotoSetCategory, 'camera' | 'lens' | 'album'> & {
  camera?: Partial<Camera>
  lens?: Partial<Lens>
  album?: Album
};

export const areOptionsSensitive = (options: PhotoQueryOptions) =>
  options.hidden === 'include' || options.hidden === 'only';

export const getJoinsFromOptions = (options: PhotoQueryOptions) =>
  options.album
    ? 'JOIN album_photo ap ON ap.photo_id = p.id'
    : undefined;

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
    album,
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
    // Selects must be within 1 week of newest upload
    // eslint-disable-next-line max-len
    wheres.push('created_at >= (SELECT MAX(created_at) - INTERVAL \'7 days\' FROM photos)');
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
  if (album) {
    wheres.push(`album_id=$${valuesIndex++}`);
    wheresValues.push(album.id);
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
      // Add date sort to account for photos with same color sort
    case 'color':
      return sortWithPriority
        ? 'ORDER BY priority_order ASC, color_sort DESC, taken_at DESC'
        : 'ORDER BY color_sort DESC, taken_at DESC';
    case 'colorAsc':
      return sortWithPriority
        ? 'ORDER BY priority_order ASC, color_sort ASC, taken_at ASC'
        : 'ORDER BY color_sort ASC, taken_at ASC';
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

export const convertArrayToPostgresString = (
  array?: string[],
  type: 'braces' | 'brackets' | 'parentheses' = 'braces', 
) => array
  ? type === 'braces'
    ? `{${array.join(',')}}`
    : type === 'brackets'
      ? `[${array.map(i => `'${i}'`).join(',')}]`
      : `(${array.map(i => `'${i}'`).join(',')})`
  : null;

export const generateManyToManyValues = (idsA: string[], idsB: string[]) => {
  const pairs: string[][] = [];

  for (const idA of idsA) {
    for (const idB of idsB) {
      pairs.push([idA, idB]);
    }
  }
  const valueString = 'VALUES ' + pairs.map((_, index) =>
    `($${index * 2 + 1},$${index * 2 + 2})`).join(',');

  const values = pairs.flat();
  
  return {
    valueString,
    values,
  };
};
