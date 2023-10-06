'use client';

import { cc } from '@/utility/css';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import SiteGrid from './SiteGrid';
import { usePathname } from 'next/navigation';
import { isPathSignIn } from '@/site/paths';

const LINK_STYLE = cc(
  'cursor-pointer',
  'hover:text-gray-600',
);

export default function FooterAuth() {
  const { data: session, status  } = useSession();

  const hasState = status !== 'loading';

  const path = usePathname();

  return (
    <SiteGrid
      contentMain={<div className={cc(
        'flex items-center',
        'my-8',
        'text-dim',
      )}>
        <div className="flex gap-x-4 gap-y-1 flex-wrap flex-grow">
          {hasState
            ? <>
              {session?.user === undefined &&
                <>Loading ...</>}
              {session?.user.email && <>
                <div>{session.user.email}</div>
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
        {!isPathSignIn(path) && <ThemeSwitcher />}
      </div>}
    />
  );
};
