// 'sort/path.ts' separate from 'sort/index.ts'
// to avoid circular dependencies

import {
  doesPathOfferSort as _doesPathOfferSort,
  PARAM_SORT_ORDER_ASCENDING,
  PARAM_SORT_ORDER_DESCENDING,
  PARAM_SORT_TYPE_LIGHTNESS,
  PARAM_SORT_TYPE_CHROMA,
  PARAM_SORT_TYPE_HUE,
  PARAM_SORT_TYPE_TAKEN_AT,
  PARAM_SORT_TYPE_UPLOADED_AT,
  PATH_FULL_INFERRED,
  PATH_GRID_INFERRED,
} from '@/app/path';
import { SortBy, SortParams } from '.';
import {
  USER_DEFAULT_SORT_BY,
  GRID_HOMEPAGE_ENABLED,
  USER_DEFAULT_SORT_WITH_PRIORITY,
} from '@/app/config';

const getSortByComponents = (sortBy: SortBy): {
  sortType: string
  sortOrder: string
} => {
  switch (sortBy) {
  case 'takenAt': return {
    sortType: PARAM_SORT_TYPE_TAKEN_AT,
    sortOrder: PARAM_SORT_ORDER_DESCENDING,
  };
  case 'takenAtAsc': return {
    sortType: PARAM_SORT_TYPE_TAKEN_AT,
    sortOrder: PARAM_SORT_ORDER_ASCENDING,
  };
  case 'createdAt': return {
    sortType: PARAM_SORT_TYPE_UPLOADED_AT,
    sortOrder: PARAM_SORT_ORDER_DESCENDING,
  };
  case 'createdAtAsc': return {
    sortType: PARAM_SORT_TYPE_UPLOADED_AT,
    sortOrder: PARAM_SORT_ORDER_ASCENDING,
  };
  case 'lightness': return {
    sortType: PARAM_SORT_TYPE_LIGHTNESS,
    sortOrder: PARAM_SORT_ORDER_DESCENDING,
  };
  case 'lightnessAsc': return {
    sortType: PARAM_SORT_TYPE_LIGHTNESS,
    sortOrder: PARAM_SORT_ORDER_ASCENDING,
  };
  case 'chroma': return {
    sortType: PARAM_SORT_TYPE_CHROMA,
    sortOrder: PARAM_SORT_ORDER_DESCENDING,
  };
  case 'chromaAsc': return {
    sortType: PARAM_SORT_TYPE_CHROMA,
    sortOrder: PARAM_SORT_ORDER_ASCENDING,
  };
  case 'hue': return {
    sortType: PARAM_SORT_TYPE_HUE,
    sortOrder: PARAM_SORT_ORDER_DESCENDING,
  };
  case 'hueAsc': return {
    sortType: PARAM_SORT_TYPE_HUE,
    sortOrder: PARAM_SORT_ORDER_ASCENDING,
  };
  }
};

export const {
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
  const isAscending = sortOrder === PARAM_SORT_ORDER_ASCENDING;
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
  case PARAM_SORT_TYPE_LIGHTNESS: {
    sortBy = isAscending
      ? 'lightnessAsc'
      : 'lightness';
    break;
  }
  case PARAM_SORT_TYPE_CHROMA: {
    sortBy = isAscending
      ? 'chromaAsc'
      : 'chroma';
    break;
  }
  case PARAM_SORT_TYPE_HUE: {
    sortBy = isAscending
      ? 'hueAsc'
      : 'hue';
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

const getPathSortComponents = (pathname: string) => {
  const [_, gridOrFull, sortType, sortOrder] = pathname.split('/');
  const { sortBy } = _getSortOptionsFromParams(sortType, sortOrder);
  return {
    gridOrFull: gridOrFull || (GRID_HOMEPAGE_ENABLED
      ? 'grid'
      : 'full'
    ),
    sortType: sortType || DEFAULT_SORT_TYPE,
    sortOrder: sortOrder || DEFAULT_SORT_ORDER,
    sortBy,
  };
};

export const getSortStateFromPath = (pathname: string) => {
  const doesPathOfferSort = _doesPathOfferSort(pathname);

  const {
    gridOrFull: _gridOrFull,
    sortType,
    sortOrder,
    sortBy,
  } = getPathSortComponents(pathname);

  const isSortedByDefault = sortBy === USER_DEFAULT_SORT_BY;
  const sortOrderReversed = sortOrder === PARAM_SORT_ORDER_DESCENDING
    ? PARAM_SORT_ORDER_ASCENDING
    : PARAM_SORT_ORDER_DESCENDING;
  const isAscending = sortOrder === PARAM_SORT_ORDER_ASCENDING;
  const isTakenAt = sortType === PARAM_SORT_TYPE_TAKEN_AT;
  const isUploadedAt = sortType === PARAM_SORT_TYPE_UPLOADED_AT;
  const isLightness = sortType === PARAM_SORT_TYPE_LIGHTNESS;
  const isChroma = sortType === PARAM_SORT_TYPE_CHROMA;
  const isHue = sortType === PARAM_SORT_TYPE_HUE;

  const getPath = ({
    gridOrFull = _gridOrFull,
    sortType,
    sortOrder,
  }: {
    gridOrFull?: string
    sortType: string
    sortOrder: string
  }) => {
    const { sortBy } = _getSortOptionsFromParams(sortType, sortOrder);
    if (sortBy === USER_DEFAULT_SORT_BY) {
      return gridOrFull === 'grid'
        ? PATH_GRID_INFERRED
        : PATH_FULL_INFERRED;
    } else {
      return `/${gridOrFull}/${sortType}/${sortOrder}`;
    }
  };

  // Core paths
  // (reset custom sort when clicking grid/full a second time)
  const pathGrid = _gridOrFull === 'grid' && sortBy !== USER_DEFAULT_SORT_BY
    ? PATH_GRID_INFERRED
    : getPath({ gridOrFull: 'grid', sortType, sortOrder });
  const pathFull = _gridOrFull === 'full' && sortBy !== USER_DEFAULT_SORT_BY
    ? PATH_FULL_INFERRED
    : getPath({ gridOrFull: 'full', sortType, sortOrder });

  // Sort toggle path
  const pathSortToggle =
    getPath({ sortType, sortOrder: sortOrderReversed });

  // Sort menu paths
  const pathDescending =
    getPath({ sortType, sortOrder: PARAM_SORT_ORDER_DESCENDING });
  const pathAscending =
    getPath({ sortType, sortOrder: PARAM_SORT_ORDER_ASCENDING });
  const pathTakenAt =
    getPath({ sortType: PARAM_SORT_TYPE_TAKEN_AT, sortOrder });
  const pathUploadedAt =
    getPath({ sortType: PARAM_SORT_TYPE_UPLOADED_AT, sortOrder });
  const pathLightness =
    getPath({ sortType: PARAM_SORT_TYPE_LIGHTNESS, sortOrder });
  const pathChroma =
    getPath({ sortType: PARAM_SORT_TYPE_CHROMA, sortOrder });
  const pathHue =
    getPath({ sortType: PARAM_SORT_TYPE_HUE, sortOrder });

  // Sort clear
  const pathClearSort = _gridOrFull === 'grid'
    ? PATH_GRID_INFERRED
    : PATH_FULL_INFERRED;

  return {
    sortBy,
    doesPathOfferSort,
    isSortedByDefault,
    isAscending,
    isTakenAt,
    isUploadedAt,
    isLightness,
    isChroma,
    isHue,
    pathGrid,
    pathFull,
    pathDescending,
    pathAscending,
    pathTakenAt,
    pathUploadedAt,
    pathLightness,
    pathChroma,
    pathHue,
    pathClearSort,
    pathSortToggle,
  };
};
