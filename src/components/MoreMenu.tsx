import React, { ReactNode, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { FiMoreHorizontal } from 'react-icons/fi';
import Link from 'next/link';

export default function MoreMenu({
  items,
  className,
  buttonClassName,
}: {
  items: {
    label: ReactNode
    icon?: ReactNode
    href?: string
    prefetch?: boolean
    action?: () => Promise<void> | void
  }[]
  className?: string
  buttonClassName?: string
}){
  const [isLoading, setIsLoading] = useState(false);

  const renderItemContent = (
    label: ReactNode,
    icon?: ReactNode,
  ) =>
    <div className="flex items-center">
      <span className="w-6">{icon}</span>
      <span>{label}</span>
    </div>;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsx(
            buttonClassName,
            'p-1 min-h-0 border-none shadow-none hover:outline-none',
            'hover:bg-gray-100 active:bg-gray-100',
            'hover:dark:bg-gray-800/75 active:dark:bg-gray-900',
            'text-dim',
          )}
          aria-label={`Choose an action for photo: ${'photo'}`}
        >
          <FiMoreHorizontal size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          className={clsx(
            className,
            'min-w-[8rem]',
            'ml-2.5',
            'p-1 rounded-md border',
            'bg-content',
            'shadow-lg dark:shadow-xl',
          )}
        >
          {items.map(({ label, icon, href, prefetch = false, action }) =>
            <DropdownMenu.Item
              key={`${label}`}
              disabled={isLoading}
              className={clsx(
                'block w-full',
                'border-none min-h-0 bg-transparent',
                'select-none hover:outline-none',
                'text-sm text-main text-left',
                'px-3 py-1.5 rounded-[3px]',
                'hover:text-main',
                'hover:bg-gray-50 active:bg-gray-100',
                'hover:dark:bg-gray-900/75 active:dark:bg-gray-900',
                'whitespace-nowrap',
                'shadow-none',
                isLoading
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
              )}
              onClick={e => {
                const result = action?.();
                if (result instanceof Promise) {
                  e.preventDefault();
                  setIsLoading(true);
                  result.finally(() => setIsLoading(false));
                }
              }}
            >
              <>
                {href &&
                  <Link
                    href={href}
                    className="hover:text-main"
                    prefetch={prefetch}
                  >
                    {renderItemContent(label, icon)}
                  </Link>}
                {action &&
                  renderItemContent(label, icon)}
              </>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
