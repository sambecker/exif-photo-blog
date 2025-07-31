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
  string: 'taken-at',
  canBeDefault: true,
}, {
  sortBy: 'takenAtAsc',
  string: 'taken-at-oldest-first',
  canBeDefault: true,
}, {
  sortBy: 'createdAt',
  string: 'uploaded-at',
  canBeDefault: true,
}, {
  sortBy: 'createdAtAsc',
  string: 'uploaded-at-oldest-first',
  canBeDefault: true,
}, {
  sortBy: 'lightness',
  string: 'lightness',
  canBeDefault: false,
}, {
  sortBy: 'lightnessAsc',
  string: 'lightness-oldest-first',
  canBeDefault: false,
}, {
  sortBy: 'chroma',
  string: 'chroma',
  canBeDefault: false,
}, {
  sortBy: 'chromaAsc',
  string: 'chroma-oldest-first',
  canBeDefault: false,
}, {
  sortBy: 'hue',
  string: 'hue',
  canBeDefault: false,
}, {
  sortBy: 'hueAsc',
  string: 'hue-oldest-first',
  canBeDefault: false,
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
  case 'lightness': return 'lightness';
  case 'lightness-oldest-first': return 'lightnessAsc';
  case 'chroma': return 'chroma';
  case 'chroma-oldest-first': return 'chromaAsc';
  case 'hue': return 'hue';
  case 'hue-oldest-first': return 'hueAsc';
  default: return 'takenAt';
  }
};

export const isSortAscending = (sortBy: SortBy) =>
  sortBy === 'takenAtAsc' ||
  sortBy === 'createdAtAsc' ||
  sortBy === 'lightnessAsc' ||
  sortBy === 'chromaAsc' ||
  sortBy === 'hueAsc';
