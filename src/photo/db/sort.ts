import { DEFAULT_SORT_BY } from '@/app/config';
import { GetPhotosOptions } from '.';

export type SortBy =
  'createdAt' |
  'createdAtAsc' |
  'takenAt' |
  'takenAtAsc' |
  'priority';

export const getSortByFromString = (sortBy = ''): SortBy => {
  switch (sortBy) {
  case 'created-at': return 'createdAt';
  case 'created-at-asc': return 'createdAtAsc';
  case 'taken-at': return 'takenAt';
  case 'taken-at-asc': return 'takenAtAsc';
  case 'priority': return 'priority';
  default:return 'takenAt';
  }
};

export const getSortDescription = (sortBy: SortBy) => {
  switch (sortBy) {
  case 'createdAt': return 'created at (newest first)';
  case 'createdAtAsc': return 'created at (oldest first)';
  case 'takenAt': return 'taken at (newest first)';
  case 'takenAtAsc': return 'taken at (oldest first)';
  case 'priority': return 'Priority-based';
  }
};

export const getOrderByFromOptions = (options: GetPhotosOptions) => {
  const { sortBy = DEFAULT_SORT_BY } = options;

  switch (sortBy) {
  case 'createdAt':
    return 'ORDER BY created_at DESC';
  case 'createdAtAsc':
    return 'ORDER BY created_at ASC';
  case 'takenAt':
    return 'ORDER BY taken_at DESC';
  case 'takenAtAsc':
    return 'ORDER BY taken_at ASC';
  case 'priority':
    return 'ORDER BY priority_order ASC, taken_at DESC';
  }
};
