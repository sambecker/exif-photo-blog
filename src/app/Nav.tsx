'use client';

import { clsx } from 'clsx/lite';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AppGrid from '../components/AppGrid';
import ViewSwitcher, { SwitcherSelection } from '@/app/ViewSwitcher';
import {
  PATH_ROOT,
  isPathAdmin,
  isPathFeed,
  isPathGrid,
  isPathTopLevel,
  isPathProtected,
  isPathSignIn,
} from '@/app/paths';
import AnimateItems from '../components/AnimateItems';
import {
  GRID_HOMEPAGE_ENABLED,
  HAS_DEFINED_SITE_DESCRIPTION,
  SITE_DESCRIPTION,
} from './config';
import { useRef } from 'react';
import useStickyNav from './useStickyNav';

const NAV_HEIGHT_CLASS = HAS_DEFINED_SITE_DESCRIPTION
  ? 'min-h-[4rem] sm:min-h-[5rem]'
  : 'min-h-[4rem]';

export default function Nav({
  siteDomainOrTitle,
}: {
  siteDomainOrTitle: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const showNav = !isPathSignIn(pathname);
  const isHome = isPathTopLevel(pathname);

  const {
    isNavSticky,
    shouldHideStickyNav,
    shouldAnimateStickyNav,
  } = useStickyNav(ref, isHome);

  const renderLink = (
    text: string,
    linkOrAction: string | (() => void),
  ) =>
    typeof linkOrAction === 'string'
      ? <Link href={linkOrAction}>{text}</Link>
      : <button onClick={linkOrAction}>{text}</button>;

  const switcherSelectionForPath = (): SwitcherSelection | undefined => {
    if (pathname === PATH_ROOT) {
      return GRID_HOMEPAGE_ENABLED ? 'grid' : 'feed';
    } else if (isPathGrid(pathname)) {
      return 'grid';
    } else if (isPathFeed(pathname)) {
      return 'feed';
    } else if (isPathProtected(pathname)) {
      return 'admin';
    }
  };

  return (
    <AppGrid
      className={clsx(
        isNavSticky && 'sticky top-0 z-10 pointer-events-none',
      )}
      classNameMain='pointer-events-auto'
      contentMain={
        <AnimateItems
          animateOnFirstLoadOnly
          type={!isPathAdmin(pathname) ? 'bottom' : 'none'}
          distanceOffset={10}
          items={showNav
            ? [<nav
              key="nav"
              ref={ref}
              className={clsx(
                'w-full',
                // Enlarge nav to ensure it fully masks underlying content
                'md:w-[calc(100%+8px)] md:translate-x-[-4px] md:px-[4px]',
                'flex items-center bg-main',
                shouldAnimateStickyNav && 'transition-transform duration-200',
                shouldHideStickyNav
                  ? 'translate-y-[-100%]'
                  : 'translate-y-0',
                NAV_HEIGHT_CLASS,
              )}>
              <ViewSwitcher
                currentSelection={switcherSelectionForPath()}
              />
              <div className={clsx(
                'grow text-right min-w-0',
                'hidden xs:block',
                'translate-y-[-1px]',
              )}>
                <div className={clsx(
                  'truncate overflow-hidden select-none',
                  HAS_DEFINED_SITE_DESCRIPTION && 'sm:font-bold',
                )}>
                  {renderLink(siteDomainOrTitle, PATH_ROOT)}
                </div>
                {HAS_DEFINED_SITE_DESCRIPTION &&
                  <div className={clsx(
                    'hidden sm:block truncate overflow-hidden',
                    'leading-tight',
                  )}>
                    {SITE_DESCRIPTION}
                  </div>}
              </div>
            </nav>]
            : []}
        />
      }
      sideHiddenOnMobile
    />
  );
};
