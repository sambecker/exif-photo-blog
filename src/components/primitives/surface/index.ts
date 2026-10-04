import MoreMenuItem from '@/components/more/MoreMenuItem';
import clsx from 'clsx/lite';
import { ComponentProps } from 'react';

export const MENU_SURFACE_STYLES = clsx(
  // Above sticky headers (z-40) and page content; below tooltips (z-100)
  'z-50',
  'min-w-[8rem]',
  'component-surface-frosted',
  'py-1',
  'not-dark:shadow-lg not-dark:shadow-gray-900/10',
  'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
  'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
  'data-[side=right]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
  'data-[side=top]:animate-fade-in-from-bottom',
  'data-[side=bottom]:animate-fade-in-from-top',
  'data-[side=right]:animate-fade-in-from-top',
);

export const getMenuItemColorClasses = (
  color?: ComponentProps<typeof MoreMenuItem>['color'],
) => {
  switch (color) {
    case 'red': return clsx(
      'hover:bg-red-200/40 active:bg-red-200/60',
      'dark:hover:bg-red-900/30 dark:active:bg-red-950/80',
    );
    case 'yellow': return clsx(
      'hover:bg-amber-200/25 active:bg-amber-100/75',
      'dark:hover:bg-amber-950/55 dark:active:bg-amber-950/80',
    );
    default: return clsx(
      'hover:bg-black/6 active:bg-black/10',
      'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
    );
  }
};
