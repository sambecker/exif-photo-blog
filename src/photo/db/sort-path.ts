// 'sort-path.ts' separate from 'sort.ts'
// to avoid circular dependencies

import {
  PARAM_SORT_ORDER_NEWEST,
  PARAM_SORT_ORDER_OLDEST,
  PARAM_SORT_TYPE_PRIORITY,
  PARAM_SORT_TYPE_TAKEN_AT,
  PARAM_SORT_TYPE_UPLOADED_AT,
  PATH_FEED,
  PATH_FEED_INFERRED,
  PATH_GRID,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import { SortBy, SortParams } from './sort';
import { DEFAULT_SORT_BY, GRID_HOMEPAGE_ENABLED } from '@/app/config';

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
  case 'priority': return {
    sortType: PARAM_SORT_TYPE_PRIORITY,
    sortOrder: PARAM_SORT_ORDER_NEWEST,
  };
  }
};

const {
  sortType: DEFAULT_SORT_TYPE,
  sortOrder: DEFAULT_SORT_ORDER,
} = getSortByComponents(DEFAULT_SORT_BY);

const _getSortByFromParams = (
  sortType = DEFAULT_SORT_TYPE,
  sortOrder = DEFAULT_SORT_ORDER,
): SortBy => {
  const isAscending = sortOrder === PARAM_SORT_ORDER_OLDEST;
  switch (sortType) {
  case PARAM_SORT_TYPE_TAKEN_AT: return isAscending
    ? 'takenAtAsc'
    : 'takenAt';
  case PARAM_SORT_TYPE_UPLOADED_AT: return isAscending
    ? 'createdAtAsc'
    : 'createdAt';
  case PARAM_SORT_TYPE_PRIORITY: return 'priority';
  default: return 'takenAt';
  }
};

export const getSortByFromParams = async (
  params: SortParams,
): Promise<SortBy> => {
  const { sortType, sortOrder } = await params;
  return _getSortByFromParams(sortType, sortOrder);
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

export const getSortPathsFromPath = (pathname: string): {
  pathGrid: string
  pathFeed: string
  pathSort: string
  isPathAscending: boolean
} => {
  const { gridOrFeed, sortType, sortOrder } = getPathSortComponents(pathname);
  const sortBy = _getSortByFromParams(sortType, sortOrder);
  const isSortedByDefault = sortBy === DEFAULT_SORT_BY;
  const reversedSortOrder = getReversedSortOrder(sortOrder);
  const isPathAscending = sortOrder === PARAM_SORT_ORDER_OLDEST;
  const doesReverseSortMatchDefault = _getSortByFromParams(
    sortType,
    reversedSortOrder,
  ) === DEFAULT_SORT_BY;
  return {
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
    isPathAscending,
  };
};
