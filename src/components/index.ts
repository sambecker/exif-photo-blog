import clsx from 'clsx/lite';

export const GRID_GAP_CLASSNAME = 'gap-0.5';

export const GRID_SPACE_CLASSNAME = 'space-y-0.5';

// Shared by nav controls so their outlines stay visually consistent
export const CONTROL_OUTLINE_CLASSNAME = clsx(
  'outline outline-medium',
  'shadow-[0_2px_4px_rgba(0,0,0,0.07)] dark:shadow-none',
);
