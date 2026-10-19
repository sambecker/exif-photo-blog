'use client';

import { clsx } from 'clsx/lite';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AppToolbar from '@/app/AppToolbar';
import {
  PATH_HOME_INFERRED,
  isPathAdmin,
  isPathAdminPhotoEdit,
  isPathSignIn,
} from '@/app/path';
import AnimateItems from '../components/AnimateItems';
import { NAV_CAPTION } from './config';
import { LAYOUT_CLASS_MAIN } from './layout-metrics';
import { useRef } from 'react';
import useStickyHeader from './useStickyHeader';
import { useAppState } from '@/app/AppState';

const NAV_HEIGHT_CLASS = NAV_CAPTION
  ? 'min-h-[4rem] sm:min-h-[5rem]'
  : 'min-h-[4rem]';

export default function NavClient({
  navTitle,
  navCaption,
  isInEmptyState,
}: {
  navTitle: string
  navCaption?: string
  isInEmptyState: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const showNav = !isPathSignIn(pathname);

  const {
    hasLoadedWithAnimations,
  } = useAppState();

  const {
    containerClassName,
    containerStyle,
    contentClassName,
    contentStyle,
    isVisible,
  } = useStickyHeader(ref, !isPathAdminPhotoEdit(pathname));

  const renderLink = (
    text: string,
    linkOrAction: string | (() => void),
  ) =>
    typeof linkOrAction === 'string'
      ? <Link href={linkOrAction}>{text}</Link>
      : <button onClick={linkOrAction} type="button">{text}</button>;

  return (
    <div
      ref={ref}
      className={clsx('w-full', containerClassName)}
      style={containerStyle}
    >
      <div
        className={clsx(
          'bg-main',
          // Full-bleed without w-screen (overflow breaks position:sticky)
          'shadow-[0_0_0_100vmax_white] dark:shadow-[0_0_0_100vmax_black]',
          '[clip-path:inset(0_-100vmax)]',
          contentClassName,
        )}
        style={contentStyle}
      >
        <AnimateItems
          className={clsx('mx-auto w-full', LAYOUT_CLASS_MAIN)}
          animateOnFirstLoadOnly
          type={!isInEmptyState && !isPathAdmin(pathname) ? 'bottom' : 'none'}
          distanceOffset={10}
          items={showNav
            ? [<nav
              key="nav"
              className={clsx(
                'w-full flex items-center gap-2 sm:gap-3',
                NAV_HEIGHT_CLASS,
              )}
            >
              <div className={clsx(
                'grow min-w-0',
                'translate-y-[-1px]',
              )}>
                <div className="truncate overflow-hidden select-none">
                  {renderLink(navTitle, PATH_HOME_INFERRED)}
                </div>
                {navCaption &&
                  <div className={clsx(
                    'hidden sm:block truncate overflow-hidden',
                    'leading-tight text-dim',
                  )}>
                    {navCaption}
                  </div>}
              </div>
              <AppToolbar
                animate={hasLoadedWithAnimations && isVisible}
                isInEmptyState={isInEmptyState}
              />
            </nav>]
            : []}
        />
      </div>
    </div>
  );
};
