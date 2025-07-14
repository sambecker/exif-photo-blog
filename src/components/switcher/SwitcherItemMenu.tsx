'use client';

import MoreMenu from '@/components/more/MoreMenu';
import { clsx } from 'clsx/lite';
import { ComponentProps } from 'react';

export default function SwitcherItemMenu({
  className,
  classNameButton,
  classNameButtonOpen,
  ...props
}: ComponentProps<typeof MoreMenu>) {
  return (
    <MoreMenu
      {...props}
      className={clsx(
        'outline-medium',
        className,
      )}
      classNameButton={clsx(
        'p-0!',
        'w-full h-full',
        'flex items-center justify-center',
        'hover:bg-transparent dark:hover:bg-transparent',
        'active:bg-transparent dark:active:bg-transparent',
        'rounded-none focus:outline-none',
        'text-gray-400 dark:text-gray-600 hover:text-main',
        classNameButton,
      )}
      classNameButtonOpen={clsx(
        'bg-dim text-main!',
        classNameButtonOpen,
      )}
    />
  );
}
