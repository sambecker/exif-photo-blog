'use client';

import { clsx } from 'clsx/lite';
import SiteGrid from '../components/SiteGrid';
import ThemeSwitcher from '@/site/ThemeSwitcher';
import Link from 'next/link';
import { SHOW_REPO_LINK } from '@/site/config';
import RepoLink from '../components/RepoLink';
import { usePathname } from 'next/navigation';
import { isPathAdmin, isPathSignIn, pathForAdminPhotos } from './paths';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { signOutAndRedirectAction } from '@/auth/actions';
import Spinner from '@/components/Spinner';
import AnimateItems from '@/components/AnimateItems';
import { useAppState } from '@/state/AppState';

export default function Footer() {
  const pathname = usePathname();

  const { userEmail, setUserEmail } = useAppState();

  const showFooter = !isPathSignIn(pathname);

  const shouldAnimate = !isPathAdmin(pathname);

  return (
    <SiteGrid
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
              <div className="flex gap-x-3 xs:gap-x-4 flex-grow flex-wrap">
                {isPathAdmin(pathname)
                  ? <>
                    {userEmail === undefined &&
                      <Spinner />}
                    {userEmail && <>
                      <div className={clsx(
                        'truncate max-w-full',
                      )}>
                        {userEmail}
                      </div>
                      <form action={() => signOutAndRedirectAction()
                        .then(() => setUserEmail?.(undefined))}>
                        <SubmitButtonWithStatus styleAsLink>
                          Sign out
                        </SubmitButtonWithStatus>
                      </form>
                    </>}
                  </>
                  : <>
                    <Link href={pathForAdminPhotos()}>
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
