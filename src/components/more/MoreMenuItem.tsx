'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { ReactNode, useState } from 'react';
import LoaderButton from '../primitives/LoaderButton';
import PathLoaderButton from '../primitives/PathLoaderButton';

export default function MoreMenuItem({
  label,
  icon,
  href,
  action,
}: {
  label: ReactNode
  icon?: ReactNode
  href?: string
  action?: () => Promise<void> | void
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'px-3 py-1.5 rounded-[3px]',
        'select-none hover:outline-none',
        'hover:bg-gray-50 active:bg-gray-100',
        'hover:dark:bg-gray-900/75 active:dark:bg-gray-900',
        'whitespace-nowrap',
        isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
      )}
    >
      {href &&
        <PathLoaderButton
          path={href}
          icon={icon}
          hideTextOnMobile={false}
          shouldPreventDefault
          styleAs="link-without-hover"
        >
          {label}
        </PathLoaderButton>}
      {action &&
        <LoaderButton
          icon={icon}
          isLoading={isLoading}
          hideTextOnMobile={false}
          styleAs="link-without-hover"
          onClick={e => {
            if (!href) {
              const result = action?.();
              if (result instanceof Promise) {
                e.preventDefault();
                setIsLoading(true);
                result.finally(() => setIsLoading(false));
              }
            }
          }}
        >
          {label}
        </LoaderButton>}
    </DropdownMenu.Item>
  );
}
