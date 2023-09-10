'use client';

import { cc } from '@/utility/css';
import SiteGrid from './SiteGrid';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Footer({
  showSignOut,
}: {
  showSignOut?: boolean
}) {
  return (
    <SiteGrid
      contentMain={<div className={cc(
        'my-8',
        'flex items-center',
        'text-gray-400 dark:text-gray-500',
      )}>
        <div className="flex gap-4 flex-grow">
          <Link
            href="/admin/photos"
            className="hover:text-gray-600 dark:hover:text-gray-400"
          >
            Admin
          </Link>
          {showSignOut &&
            <div
              className={cc(
                'cursor-pointer',
                'hover:text-gray-600 dark:hover:text-gray-400',
              )}
              onClick={() => signOut()}
            >
              Sign out
            </div>}
        </div>
        <ThemeSwitcher />
      </div>}
    />
  );
}
