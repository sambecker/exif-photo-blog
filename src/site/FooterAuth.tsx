'use client';

import { cc } from '@/utility/css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import SiteGrid from '../components/SiteGrid';
import { usePathname } from 'next/navigation';
import { isPathSignIn } from '@/site/paths';
import { signOutAction } from '@/auth/action';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';

const LINK_STYLE = cc(
  'cursor-pointer',
  'hover:text-gray-300',
  'hover:dark:text-gray-600',
);

export default function FooterAuth() {
  const { data: session, status  } = useSession();

  const path = usePathname();

  return (
    <SiteGrid
      contentMain={<div className={cc(
        'flex items-center',
        'my-8',
        'text-dim',
      )}>
        <div className="flex gap-x-4 gap-y-1 flex-wrap items-center flex-grow">
          {status === 'loading'
            ? <>Loading ...</>
            : <>
              {session?.user?.email && <div>
                {session.user.email}
              </div>}
              {status === 'authenticated' &&
                <form action={signOutAction}>
                  <SubmitButtonWithStatus
                    className={LINK_STYLE}
                    styleAsLink
                  >
                    Sign Out
                  </SubmitButtonWithStatus>
                </form>}
              {status === 'unauthenticated' &&
                <Link
                  href="/sign-in"
                  className={LINK_STYLE}
                >
                  Sign In
                </Link>}
            </>}
        </div>
        {!isPathSignIn(path) && <ThemeSwitcher />}
      </div>}
    />
  );
};
