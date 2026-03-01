import clsx from 'clsx/lite';

export const menuSurfaceStyles = (className?: string) => clsx(
  'z-10',
  'min-w-[8rem]',
  'component-surface',
  'py-1',
  'not-dark:shadow-lg not-dark:shadow-gray-900/10',
  'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
  'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
  'data-[side=right]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
  'data-[side=top]:animate-fade-in-from-bottom',
  'data-[side=bottom]:animate-fade-in-from-top',
  'data-[side=right]:animate-fade-in-from-top',
  className,
);
