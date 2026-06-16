'use client';

/* eslint-disable max-len */

import { usePathname } from 'next/navigation';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import {
  PATH_ADMIN_CONFIGURATION,
  PATH_ADMIN_INSIGHTS,
  PATH_ADMIN_PHOTOS,
  PATH_ADMIN_REPORT,
  PATH_ADMIN_TAGS,
  PATH_ADMIN_UPLOADS,
} from '@/app/path';
import { useAppState } from '@/app/AppState';
import { useSelection } from '@/selection/SelectionContext';
import { useAppText } from '@/i18n/state/client';
import AdminMenuIcon from './AdminMenuIcon';
import { useState } from 'react';
import {
  FiImage,
  FiUploadCloud,
  FiTag,
  FiSettings,
  FiBarChart2,
} from 'react-icons/fi';

export default function AdminAppMenu() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const { selectionMode: isSelecting, toggleSelectionMode } = useSelection();

  const appText = useAppText();

  const menuItems = [
    {
      label: appText.admin.managePhotos,
      href: PATH_ADMIN_PHOTOS,
      active: pathname.startsWith(PATH_ADMIN_PHOTOS),
      icon: <FiImage size={16} className='translate-y-[-1px]' />,
    },
    {
      label: appText.admin.uploadPlural,
      href: PATH_ADMIN_UPLOADS,
      active: pathname.startsWith(PATH_ADMIN_UPLOADS),
      icon: <FiUploadCloud size={16} className='translate-y-[-1px]' />,
    },
    {
      label: appText.admin.manageTags,
      href: PATH_ADMIN_TAGS,
      active: pathname.startsWith(PATH_ADMIN_TAGS),
      icon: <FiTag size={16} className='translate-y-[-1px]' />,
    },
    {
      label: appText.admin.appConfig,
      href: PATH_ADMIN_CONFIGURATION,
      active: pathname.startsWith(PATH_ADMIN_CONFIGURATION),
      icon: <FiSettings size={16} className='translate-y-[-1px]' />,
    },
    {
      label: appText.admin.appInsights,
      href: PATH_ADMIN_INSIGHTS,
      active: pathname.startsWith(PATH_ADMIN_INSIGHTS),
      icon: <FiBarChart2 size={16} className='translate-y-[-1px]' />,
    },
    {
      label: 'Report',
      href: PATH_ADMIN_REPORT,
      active: pathname.startsWith(PATH_ADMIN_REPORT),
      icon: <FiBarChart2 size={16} className='translate-y-[-1px]' />,
    },
  ];

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className={clsx(
            'flex items-center justify-center w-[42px] h-[28px] cursor-pointer',
            'hover:bg-gray-100/60 active:bg-gray-100',
            'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
            'text-gray-400 dark:text-gray-600',
            'hover:text-gray-700 dark:hover:text-gray-400',
            isOpen &&
              'bg-dim text-main! [&>*>*]:translate-y-[6px] [&>*>*]:duration-300',
          )}
          aria-label='Admin Menu'
        >
          <AdminMenuIcon isOpen={isOpen} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align='start'
          className={clsx(
            'z-50 min-w-[8rem] component-surface py-1 not-dark:shadow-lg',
            'not-dark:shadow-gray-900/10',
            'data-[side=top]:dark:shadow-[0_0px_40px_rgba(0,0,0,0.6)]',
            'data-[side=bottom]:dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]',
            'data-[side=top]:animate-fade-in-from-bottom',
            'data-[side=bottom]:animate-fade-in-from-top',
            'outline-medium',
          )}
        >
          <div className='divide-y divide-medium'>
            <div className='px-1 py-1'>
              {menuItems.map((item) => (
                <DropdownMenu.Item key={item.href} asChild>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-2 block px-2 py-2 text-sm rounded-md',
                      'hover:outline-hidden hover:bg-gray-100/90 active:bg-gray-200/75',
                      'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
                      item.active && 'bg-gray-100/90 dark:bg-gray-800/60',
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </div>
            <div className='px-1 py-1'>
              <DropdownMenu.Item asChild>
                <button
                  onClick={toggleSelectionMode}
                  className={clsx(
                    'block px-2 py-2 text-sm w-full text-left rounded-md',
                    'hover:outline-hidden hover:bg-gray-100/90 active:bg-gray-200/75',
                    'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
                  )}
                >
                  {isSelecting
                    ? appText.admin.batchExitEdit
                    : appText.admin.batchEdit}
                </button>
              </DropdownMenu.Item>
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
