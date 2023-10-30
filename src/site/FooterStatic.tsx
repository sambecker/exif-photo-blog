'use client';

import { cc } from '@/utility/css';
import SiteGrid from '../components/SiteGrid';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { SHOW_REPO_LINK } from '@/site/config';
import RepoLink from '../components/RepoLink';

export default function FooterStatic({
  showSignOut,
}: {
  showSignOut?: boolean
}) {
  return (
    <SiteGrid
      contentMain={<div className={cc(
        'my-8',
        'flex items-center',
        'text-dim',
      )}>
        <div className="flex gap-x-4 gap-y-1 flex-grow flex-wrap">
          <Link
            href="/admin/photos"
            className="hover:text-gray-600 dark:hover:text-gray-400"
          >
            Admin
          </Link>
          {SHOW_REPO_LINK &&
            <RepoLink />}
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
