'use client';

import { pathForAdminPhotoEdit } from '@/site/paths';
import { Menu } from '@headlessui/react';
import clsx from 'clsx/lite';
import Link from 'next/link';
import { FiMoreHorizontal } from 'react-icons/fi';

export interface AdminPhotoMenuClientProps {
  photoId: string
  className?: string
  buttonClassName?: string
}

export default function AdminPhotoMenuClient({
  photoId,
  className,
  buttonClassName,
}: AdminPhotoMenuClientProps) {
  return (
    <div className={clsx(
      className,
      'relative',
    )}>
      <Menu>
        <Menu.Button className={clsx(
          buttonClassName,
          'p-1 py-1 min-h-0 border-none shadow-none',
          'text-dim',
        )}
        >
          <FiMoreHorizontal size={16} />
        </Menu.Button>
        <Menu.Items className={clsx(
          'absolute top-6 right-1',
          'text-sm',
          'px-3 py-1.5 rounded-md border',
          'bg-content',
        )}>
          <Menu.Item>
            <Link
              className="whitespace-nowrap"
              href={pathForAdminPhotoEdit(photoId)}
            >
              Edit Photo
            </Link>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  );
}
