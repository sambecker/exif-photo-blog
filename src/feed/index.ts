import { USER_DEFAULT_SORT_OPTIONS } from '@/app/config';
import { PhotoQueryOptions } from '../photo/db';
import {
  INFINITE_SCROLL_FULL_INITIAL,
  INFINITE_SCROLL_GRID_INITIAL,
} from '../photo';
import { SortBy } from '../photo/db/sort';
import { FEED_PHOTO_REQUEST_LIMIT } from './programmatic';

const FEED_BASE_QUERY_OPTIONS: PhotoQueryOptions = {
  excludeFromFeeds: true,
};

// PAGE FEED QUERY OPTIONS

export const getFeedQueryOptions = ({
  isGrid,
  sortBy = USER_DEFAULT_SORT_OPTIONS.sortBy,
  sortWithPriority = USER_DEFAULT_SORT_OPTIONS.sortWithPriority,
}: {
  isGrid: boolean,
  sortBy?: SortBy,
  sortWithPriority?: boolean,
}): PhotoQueryOptions => ({
  ...FEED_BASE_QUERY_OPTIONS,
  sortBy,
  sortWithPriority,
  limit: isGrid
    ? INFINITE_SCROLL_GRID_INITIAL
    : INFINITE_SCROLL_FULL_INITIAL,
});

export const FEED_META_QUERY_OPTIONS: PhotoQueryOptions = {
  ...FEED_BASE_QUERY_OPTIONS,
};

// PROGRAMMATIC FEED QUERY OPTIONS

export const PROGRAMMATIC_QUERY_OPTIONS: PhotoQueryOptions = {
  ...FEED_BASE_QUERY_OPTIONS,
  sortBy: 'createdAt',
  limit: FEED_PHOTO_REQUEST_LIMIT,
};
