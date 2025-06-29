// 'sort-path.ts' separate from 'sort.ts'
// to avoid circular dependencies

import {
  PARAM_SORT_ORDER_NEWEST,
  PARAM_SORT_ORDER_OLDEST,
  PARAM_SORT_TYPE_TAKEN_AT,
  PARAM_SORT_TYPE_UPLOADED_AT,
  PATH_FEED,
  PATH_FEED_INFERRED,
  PATH_GRID,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import { SortBy, SortParams } from './sort';
import {
  USER_DEFAULT_SORT_BY,
  GRID_HOMEPAGE_ENABLED,
  USER_DEFAULT_SORT_WITH_PRIORITY,
} from '@/app/config';

export const getSortByComponents = (sortBy: SortBy): {
  sortType: string
  sortOrder: string
} => {
  switch (sortBy) {
  case 'takenAt': return {
    sortType: PARAM_SORT_TYPE_TAKEN_AT,
    sortOrder: PARAM_SORT_ORDER_NEWEST,
  };
  case 'takenAtAsc': return {
    sortType: PARAM_SORT_TYPE_TAKEN_AT,
    sortOrder: PARAM_SORT_ORDER_OLDEST,
  };
  case 'createdAt': return {
    sortType: PARAM_SORT_TYPE_UPLOADED_AT,
    sortOrder: PARAM_SORT_ORDER_NEWEST,
  };
  case 'createdAtAsc': return {
    sortType: PARAM_SORT_TYPE_UPLOADED_AT,
    sortOrder: PARAM_SORT_ORDER_OLDEST,
  };
  }
};

const {
  sortType: DEFAULT_SORT_TYPE,
  sortOrder: DEFAULT_SORT_ORDER,
} = getSortByComponents(USER_DEFAULT_SORT_BY);

const _getSortOptionsFromParams = (
  sortType = DEFAULT_SORT_TYPE,
  sortOrder = DEFAULT_SORT_ORDER,
): {
  sortBy: SortBy
  sortWithPriority: boolean
} => {
  let sortBy: SortBy = 'takenAt';
  const isAscending = sortOrder === PARAM_SORT_ORDER_OLDEST;
  switch (sortType) {
  case PARAM_SORT_TYPE_TAKEN_AT: {
    sortBy = isAscending
      ? 'takenAtAsc'
      : 'takenAt';
    break;
  }
  case PARAM_SORT_TYPE_UPLOADED_AT: {
    sortBy = isAscending
      ? 'createdAtAsc'
      : 'createdAt';
    break;
  }
  }
  return {
    sortBy,
    sortWithPriority: USER_DEFAULT_SORT_WITH_PRIORITY,
  };
};

export const getSortOptionsFromParams = async (
  params: SortParams,
): Promise<ReturnType<typeof _getSortOptionsFromParams>> => {
  const { sortType, sortOrder } = await params;
  return _getSortOptionsFromParams(sortType, sortOrder);
};

export const getPathSortComponents = (pathname: string) => {
  const [_, gridOrFeed, sortType, sortOrder] = pathname.split('/');
  return {
    gridOrFeed: gridOrFeed || (GRID_HOMEPAGE_ENABLED
      ? 'grid'
      : 'feed'
    ),
    sortType: sortType || DEFAULT_SORT_TYPE,
    sortOrder: sortOrder || DEFAULT_SORT_ORDER,
  };
};

const getReversedSortOrder = (sortOrder: string): string =>
  sortOrder === PARAM_SORT_ORDER_OLDEST
    ? PARAM_SORT_ORDER_NEWEST
    : PARAM_SORT_ORDER_OLDEST;

export const getSortConfigFromPath = (pathname: string) => {
  const { gridOrFeed, sortType, sortOrder } = getPathSortComponents(pathname);
  const { sortBy } = _getSortOptionsFromParams(sortType, sortOrder);
  const isSortedByDefault = sortBy === USER_DEFAULT_SORT_BY;
  const reversedSortOrder = getReversedSortOrder(sortOrder);
  const isAscending = sortOrder === PARAM_SORT_ORDER_OLDEST;
  const doesReverseSortMatchDefault = _getSortOptionsFromParams(
    sortType,
    reversedSortOrder,
  ).sortBy === USER_DEFAULT_SORT_BY;
  return {
    sortBy,
    isAscending,
    pathGrid: isSortedByDefault
      ? PATH_GRID_INFERRED
      : `${PATH_GRID}/${sortType}/${sortOrder}`,
    pathFeed: isSortedByDefault
      ? PATH_FEED_INFERRED
      : `${PATH_FEED}/${sortType}/${sortOrder}`,
    pathSort: doesReverseSortMatchDefault
      ? gridOrFeed === 'grid'
        ? PATH_GRID_INFERRED
        : PATH_FEED_INFERRED
      : `/${gridOrFeed}/${sortType}/${reversedSortOrder}`,
  };
};
