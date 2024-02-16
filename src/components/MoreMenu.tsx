import { clsx}  from 'clsx/lite';
import Link from 'next/link';
import { Menu } from '@headlessui/react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { Fragment, ReactNode, useState } from 'react';

export default function MoreMenu({
  items,
  className,
  buttonClassName,
}: {
  items: {
    label: ReactNode,
    icon?: ReactNode,
    href?: string,
    action?: () => Promise<void>,
  }[]
  className?: string
  buttonClassName?: string
}) {
  const [isLoading, setIsLoading] = useState(false);

  const itemClass = clsx(
    'block w-full',
    'border-none min-h-0 bg-transparent',
    'text-sm text-main text-left',
    'px-3 py-1.5 rounded-[3px]',
    'hover:text-main',
    'hover:bg-gray-50 active:bg-gray-100',
    'hover:dark:bg-gray-900/75 active:dark:bg-gray-900',
    'whitespace-nowrap',
    'shadow-none',
    isLoading && 'cursor-not-allowed opacity-50',
  );

  const renderItemContent = (
    label: ReactNode,
    icon?: ReactNode,
  ) =>
    <div className="flex items-center">
      <span className="w-6">{icon}</span>
      <span>{label}</span>
    </div>;

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
          'absolute top-6',
          'min-w-[8rem]',
          'text-left',
          'md:right-1',
          'p-1 rounded-md border',
          'bg-content outline-none',
          'shadow-lg dark:shadow-xl',
        )}>
          {items.map(({ label, icon, href, action }) =>
            <Menu.Item
              key={`${label}`}
              disabled={isLoading}
              as={Fragment}
            >
              <>
                {href &&
                  <Link
                    href={href}
                    className={itemClass}
                  >
                    {renderItemContent(label, icon)}
                  </Link>}
                {action &&
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      action().finally(() => setIsLoading(false));
                    }}
                    className={itemClass}
                  >
                    {renderItemContent(label, icon)}
                  </button>}
              </>
            </Menu.Item>
          )}
        </Menu.Items>
      </Menu>
    </div>
  );
}
