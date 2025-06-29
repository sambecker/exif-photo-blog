import { GetPhotosOptions } from '.';

export type SortBy =
  'createdAt' |
  'createdAtAsc' |
  'takenAt' |
  'takenAtAsc' |
  'priority';

export type SortParams = Promise<{
  sortType: string
  sortOrder: string
}>

export interface SortProps {
  params: SortParams
}

export const getSortByFromString = (sortBy = ''): SortBy => {
  switch (sortBy) {
  case 'taken-at': return 'takenAt';
  case 'taken-at-oldest-first': return 'takenAtAsc';
  case 'uploaded-at': return 'createdAt';
  case 'uploaded-at-oldest-first': return 'createdAtAsc';
  case 'priority': return 'priority';
  default:return 'takenAt';
  }
};

export const getSortDescription = (sortBy: SortBy) => {
  switch (sortBy) {
  case 'takenAt': return 'taken at (newest first)';
  case 'takenAtAsc': return 'taken at (oldest first)';
  case 'createdAt': return 'uploaded at (newest first)';
  case 'createdAtAsc': return 'uploaded at (oldest first)';
  case 'priority': return 'priority-based';
  }
};

export const getOrderByFromOptions = (options: GetPhotosOptions) => {
  const { sortBy = 'takenAt' } = options;

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

export const isSortAscending = (sortBy: SortBy) =>
  sortBy === 'takenAtAsc' || sortBy === 'createdAtAsc';
