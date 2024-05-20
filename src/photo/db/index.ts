import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { PRIORITY_ORDER_ENABLED } from '@/site/config';
import { parameterize } from '@/utility/string';

export const GENERATE_STATIC_PARAMS_LIMIT = 1000;
export const PHOTO_DEFAULT_LIMIT = 100;

export type GetPhotosOptions = {
  sortBy?: 'createdAt' | 'takenAt' | 'priority';
  limit?: number;
  offset?: number;
  query?: string;
  tag?: string;
  camera?: Camera;
  simulation?: FilmSimulation;
  takenBefore?: Date;
  takenAfterInclusive?: Date;
  hidden?: 'exclude' | 'include' | 'only';
};

export const getWheresFromOptions = (
  options: GetPhotosOptions,
  initialValuesIndex = 1
) => {
  const {
    hidden = 'exclude',
    takenBefore,
    takenAfterInclusive,
    query,
    tag,
    camera,
    simulation,
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
    wheres.push(`taken_at > $${valuesIndex++}`);
    wheresValues.push(takenBefore.toISOString());
  }
  if (takenAfterInclusive) {
    wheres.push(`taken_at <= $${valuesIndex++}`);
    wheresValues.push(takenAfterInclusive.toISOString());
  }
  if (query) {
    // eslint-disable-next-line max-len
    wheres.push(`CONCAT(title, ' ', caption, ' ', semantic_description) ILIKE $${valuesIndex++}`);
    wheresValues.push(`%${query.toLocaleLowerCase()}%`);
  }
  if (tag) {
    wheres.push(`$${valuesIndex++}=ANY(tags)`);
    wheresValues.push(tag);
  }
  if (camera) {
    wheres.push(`LOWER(REPLACE(make, ' ', '-'))=$${valuesIndex++}`);
    wheres.push(`LOWER(REPLACE(model, ' ', '-'))=$${valuesIndex++}`);
    wheresValues.push(parameterize(camera.make, true));
    wheresValues.push(parameterize(camera.model, true));
  }
  if (simulation) {
    wheres.push(`film_simulation=$${valuesIndex++}`);
    wheresValues.push(simulation);
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
