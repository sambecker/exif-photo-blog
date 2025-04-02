'use client';

import { clsx } from 'clsx/lite';
import AppGrid from '../components/AppGrid';
import ThemeSwitcher from '@/app/ThemeSwitcher';
import Link from 'next/link';
import { SHOW_REPO_LINK } from '@/app/config';
import RepoLink from '../components/RepoLink';
import { usePathname } from 'next/navigation';
import { PATH_ADMIN_PHOTOS, isPathAdmin, isPathSignIn } from './paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { signOutAction } from '@/auth/actions';
import Spinner from '@/components/Spinner';
import AnimateItems from '@/components/AnimateItems';
import { useAppState } from '@/state/AppState';

export default function Footer() {
  const pathname = usePathname();

  const { userEmail, clearAuthStateAndRedirectIfNecessary } = useAppState();

  const showFooter = !isPathSignIn(pathname);

  const shouldAnimate = !isPathAdmin(pathname);

  return (
    <AppGrid
      contentMain={
        <AnimateItems
          animateOnFirstLoadOnly
          type={!shouldAnimate ? 'none' : 'bottom'}
          distanceOffset={10}
          items={showFooter
            ? [<div
              key="footer"
              className={clsx(
                'flex items-center gap-1',
                'text-dim min-h-10',
              )}>
              <div className="flex gap-x-3 xs:gap-x-4 grow flex-wrap">
                {isPathAdmin(pathname)
                  ? <>
                    {userEmail === undefined &&
                      <Spinner size={14} className="translate-y-[2px]" />}
                    {userEmail && <>
                      <div className={clsx(
                        'truncate max-w-full',
                      )}>
                        {userEmail}
                      </div>
                      <form action={() => signOutAction()
                        .then(clearAuthStateAndRedirectIfNecessary)}>
                        <SubmitButtonWithStatus styleAs="link">
                          Sign out
                        </SubmitButtonWithStatus>
                      </form>
                    </>}
                  </>
                  : <>
                    <Link href={PATH_ADMIN_PHOTOS}>
                      Admin
                    </Link>
                    {SHOW_REPO_LINK &&
                      <RepoLink />}
                  </>}
              </div>
              <div className="flex items-center h-10">
                <ThemeSwitcher />
              </div>
            </div>]
            : []}
        />}
    />
  );
}
