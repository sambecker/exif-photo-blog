'use client';

import { cc } from '@/utility/css';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import SiteGrid from './SiteGrid';
import { usePathname } from 'next/navigation';
import { isRouteSignIn } from '@/site/routes';

const LINK_STYLE = cc(
  'cursor-pointer',
  'hover:text-gray-600',
);

export default function AuthNav() {
  const { user, signOut } = useClerk();

  const hasState = signOut !== undefined;

  const path = usePathname();

  return (
    <SiteGrid
      contentMain={<div className={cc(
        'flex items-center',
        'text-gray-400 dark:text-gray-500',
      )}>
        <div className="flex gap-4 flex-grow">
          {hasState
            ? <>
              {user === undefined &&
                <>Loading ...</>}
              {user !== undefined && user !== null && <>
                <div>{user?.emailAddresses[0].emailAddress}</div>
                <div
                  onClick={() => signOut()}
                  className={LINK_STYLE}
                >
                  Sign Out
                </div>
              </>}
            </>
            : <Link
              href="/sign-in"
              className={LINK_STYLE}
            >
              Sign In
            </Link>}
        </div>
        {!isRouteSignIn(path) && <ThemeSwitcher />}
      </div>}
    />
  );
};
