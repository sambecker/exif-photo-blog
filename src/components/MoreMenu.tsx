import clsx from 'clsx/lite';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { ReactNode } from 'react';

export default function MoreMenu({
  className,
  buttonClassName,
  items,
}: {
  className?: string
  buttonClassName?: string
  items: { href: string, label: ReactNode }[],
}) {
  return (
    <div className={clsx(
      className,
      'relative',
    )}>
      <Menu>
        <Menu.Button className={clsx(
          buttonClassName,
          'p-1 py-1 min-h-0 border-none shadow-none outline-none',
          'text-dim',
        )}
        >
          <FiMoreHorizontal size={16} />
        </Menu.Button>
        <Menu.Items className={clsx(
          'block',
          'absolute top-6 right-1 outline-none h-auto',
          'text-sm',
          'p-0.5 rounded-md border',
          'bg-content',
        )}>
          {items.map(({ href, label }) =>
            <Menu.Item key={href}>
              <Link
                href={href}
                className={clsx(
                  'block',
                  'px-3 py-1.5 rounded-[4px]',
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
