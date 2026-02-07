export type NavSortControl = 'none' | 'toggle' | 'menu';

export const NAV_SORT_CONTROL_DEFAULT: NavSortControl = 'toggle';

export const getNavSortControlFromString = (
  navSortControl = '',
): NavSortControl => {
  switch (navSortControl.toLocaleLowerCase()) {
    case 'none': return 'none';
    case 'toggle': return 'toggle';
    case 'menu': return 'menu';
    default: return NAV_SORT_CONTROL_DEFAULT;
  }
};

export const SORT_BY_OPTIONS = [{
  sortBy: 'takenAt',
  configKey: 'taken-at',
}, {
  sortBy: 'takenAtAsc',
  configKey: 'taken-at-oldest-first',
}, {
  sortBy: 'createdAt',
  configKey: 'uploaded-at',
}, {
  sortBy: 'createdAtAsc',
  configKey: 'uploaded-at-oldest-first',
}, {
  sortBy: 'color',
  configKey: undefined,
}, {
  sortBy: 'colorAsc',
  configKey: undefined,
}] as const;

export type SortBy = (typeof SORT_BY_OPTIONS)[number]['sortBy'];

export const DEFAULT_SORT_BY_OPTIONS = SORT_BY_OPTIONS
  .filter(({ configKey }) => configKey);

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
    case 'color': return 'color';
    case 'color-ascending': return 'colorAsc';
    default: return 'takenAt';
  }
};

export const isSortAscending = (sortBy: SortBy) =>
  sortBy === 'takenAtAsc' ||
  sortBy === 'createdAtAsc' ||
  sortBy === 'colorAsc';
