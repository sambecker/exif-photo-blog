import clsx from 'clsx/lite';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { ReactNode } from 'react';

export default function MoreMenu({
  items,
  className,
  buttonClassName,
}: {
  items: { href: string, label: ReactNode }[]
  className?: string
  buttonClassName?: string
}) {
  return (
    <div className={clsx(
      className,
      'relative z-10',
    )}>
      <Menu>
        <Menu.Button className={clsx(
          buttonClassName,
          'p-1 py-1 min-h-0 border-none shadow-none outline-none',
          'text-dim',
        )}
        >
          <FiMoreHorizontal size={18} />
        </Menu.Button>
        <Menu.Items className={clsx(
          'block outline-none h-auto',
          'absolute top-6',
          'md:right-1',
          'text-sm',
          'p-1 rounded-md border',
          'bg-content',
        )}>
          {items.map(({ href, label }) =>
            <Menu.Item key={href}>
              <Link
                href={href}
                className={clsx(
                  'block',
                  'px-3 py-1.5 rounded-[3px]',
                  'hover:text-main',
                  'hover:bg-gray-50 active:bg-gray-100',
                  'hover:dark:bg-gray-900/75 active:dark:bg-gray-900',
                  'whitespace-nowrap',
                )}
              >
                {label}
              </Link>
            </Menu.Item>
          )}
        </Menu.Items>
      </Menu>
    </div>
  );
}
