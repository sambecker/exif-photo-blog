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
        'outline outline-medium',
        className,
      )}
      classNameButton={clsx(
        'p-0!',
        'w-full h-full',
        'flex items-center justify-center',
        // Parent SwitcherItem owns hover/active chrome — keep trigger clear
        'bg-transparent!',
        'hover:bg-transparent! dark:hover:bg-transparent!',
        'active:bg-transparent! dark:active:bg-transparent!',
        'rounded-md focus:outline-none',
        // Inherit color from SwitcherItem (active / hover / persist)
        'text-inherit!',
        classNameButton,
      )}
      classNameButtonOpen={clsx(
        // Keep clear so parent SwitcherItem persistHover chrome shows
        'bg-transparent!',
        'text-main!',
        classNameButtonOpen,
      )}
    />
  );
}
