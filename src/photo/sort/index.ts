export const SORT_BY_OPTIONS = [{
  sortBy: 'takenAt',
  string: 'taken-at',
  label: 'Taken At (Newest First)',
}, {
  sortBy: 'takenAtAsc',
  string: 'taken-at-oldest-first',
  label: 'Taken At (Oldest First)',
}, {
  sortBy: 'createdAt',
  string: 'uploaded-at',
  label: 'Uploaded At (Newest First)',
}, {
  sortBy: 'createdAtAsc',
  string: 'uploaded-at-oldest-first',
  label: 'Uploaded At (Oldest First)',
}] as const;

export type SortBy = (typeof SORT_BY_OPTIONS)[number]['sortBy'];

export const APP_DEFAULT_SORT_BY: SortBy = 'takenAt';

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
  default:return 'takenAt';
  }
};

export const isSortAscending = (sortBy: SortBy) =>
  sortBy === 'takenAtAsc' || sortBy === 'createdAtAsc';
