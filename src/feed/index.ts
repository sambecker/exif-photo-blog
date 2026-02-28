import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { PhotoQueryOptions } from '@/db';
import {
  INFINITE_SCROLL_FULL_INITIAL,
  INFINITE_SCROLL_GRID_INITIAL,
} from '../photo';
import { SortBy } from '../photo/sort';
import { FEED_PHOTO_REQUEST_LIMIT } from './programmatic';

const FEED_BASE_QUERY_OPTIONS: PhotoQueryOptions = {
  excludeFromFeeds: true,
};

// PAGE FEED QUERY OPTIONS

export const feedQueryOptions = ({
  isGrid,
  sortBy = USER_DEFAULT_SORT_OPTIONS.sortBy,
  sortWithPriority = USER_DEFAULT_SORT_OPTIONS.sortWithPriority,
  ...options
}: {
  isGrid: boolean,
  sortBy?: SortBy,
  sortWithPriority?: boolean,
} & PhotoQueryOptions): PhotoQueryOptions => ({
  ...FEED_BASE_QUERY_OPTIONS,
  sortBy,
  sortWithPriority,
  limit: isGrid
    ? INFINITE_SCROLL_GRID_INITIAL
    : INFINITE_SCROLL_FULL_INITIAL,
  ...options,
});

export const FEED_META_QUERY_OPTIONS: PhotoQueryOptions = {
  ...FEED_BASE_QUERY_OPTIONS,
};

// APP OG IMAGE QUERY OPTIONS

export const APP_OG_IMAGE_QUERY_OPTIONS: PhotoQueryOptions = {
  ...FEED_BASE_QUERY_OPTIONS,
  ...USER_DEFAULT_SORT_OPTIONS,
};

// PROGRAMMATIC FEED QUERY OPTIONS

export const PROGRAMMATIC_QUERY_OPTIONS: PhotoQueryOptions = {
  ...FEED_BASE_QUERY_OPTIONS,
  sortBy: 'createdAt',
  limit: FEED_PHOTO_REQUEST_LIMIT,
};
