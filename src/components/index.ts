import { GRID_ASPECT_RATIO } from '@/app/config';

export const GRID_GAP_CLASSNAME = GRID_ASPECT_RATIO === 0
  ? 'gap-1 sm:gap-2'
  : 'gap-0.5 sm:gap-1';

export const GRID_SPACE_CLASSNAME = GRID_ASPECT_RATIO === 0
  ? 'space-y-1 sm:space-y-2'
  : 'space-y-0.5 sm:space-y-1';
