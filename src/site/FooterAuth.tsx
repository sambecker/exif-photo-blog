'use client';

import { clsx } from 'clsx/lite';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import SiteGrid from '../components/SiteGrid';
import { usePathname } from 'next/navigation';
import { isPathSignIn } from '@/site/paths';
import { signOutAction } from '@/auth/action';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';

const LINK_STYLE = clsx(
  'cursor-pointer',
  'hover:text-gray-300',
  'hover:dark:text-gray-600',
);

export default function FooterAuth({
  email,
}: {
  email: string | null | undefined
}) {
  const path = usePathname();

  return (
    <SiteGrid
      contentMain={<div className={clsx(
        'flex items-center',
        'my-8',
        'text-dim',
      )}>
        <div className="flex gap-x-4 gap-y-1 flex-wrap items-center flex-grow">
          <div>{email}</div>
          <form action={signOutAction}>
            <SubmitButtonWithStatus
              className={LINK_STYLE}
              styleAsLink
            >
              Sign Out
            </SubmitButtonWithStatus>
          </form>
        </div>
        {!isPathSignIn(path) && <ThemeSwitcher />}
      </div>}
    />
  );
};
