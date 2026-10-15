'use client';

import { clsx } from 'clsx/lite';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import AppGrid from '../components/AppGrid';
import AppToolbar from '@/app/AppToolbar';
import {
  PATH_ROOT,
  isPathAdmin,
  isPathAdminPhotoEdit,
  isPathFloating,
  isPathSignIn,
} from '@/app/path';
import AnimateItems from '../components/AnimateItems';
import { NAV_CAPTION } from './config';
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
  const isFloating = isPathFloating(pathname);

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

  const navInner = (
    <>
      <AppToolbar
        animate={hasLoadedWithAnimations && isVisible}
        isInEmptyState={isInEmptyState}
      />
      <div className={clsx(
        'grow text-right min-w-0',
        'translate-y-[-1px]',
      )}>
        <div className="truncate overflow-hidden select-none">
          {renderLink(navTitle, PATH_ROOT)}
        </div>
        {navCaption &&
          <div className={clsx(
            'hidden sm:block truncate overflow-hidden',
            'leading-tight text-dim',
          )}>
            {navCaption}
          </div>}
      </div>
    </>
  );

  // Full-bleed sticky bar; content stays main-column width and centered.
  // Avoid w-screen/100vw full-bleed, horizontal overflow breaks position:sticky
  // (and thus scroll hide/show). box-shadow + clip-path paints edge-to-edge
  // without creating a scroll container.
  if (isFloating) {
    return (
      <div
        ref={ref}
        className={clsx('w-full', containerClassName)}
        style={containerStyle}
      >
        <div
          className={clsx(
            'bg-main',
            'shadow-[0_0_0_100vmax_white] dark:shadow-[0_0_0_100vmax_black]',
            '[clip-path:inset(0_-100vmax)]',
            contentClassName,
          )}
          style={contentStyle}
        >
          <AnimateItems
            className="mx-auto w-full max-w-[956px]"
            animateOnFirstLoadOnly
            type={!isInEmptyState && !isPathAdmin(pathname)
              ? 'bottom'
              : 'none'}
            distanceOffset={10}
            items={showNav
              ? [<nav
                key="nav"
                className={clsx(
                  'w-full flex items-center gap-1.5 sm:gap-2',
                  NAV_HEIGHT_CLASS,
                )}
              >
                {navInner}
              </nav>]
              : []}
          />
        </div>
      </div>
    );
  }

  return (
    <AppGrid
      containerRef={ref}
      className={containerClassName}
      style={containerStyle}
      classNameMain={clsx(
        // Stationary column would cover banners after the nav slides away
        'pointer-events-none!',
      )}
      contentMain={
        <AnimateItems
          animateOnFirstLoadOnly
          type={!isInEmptyState && !isPathAdmin(pathname) ? 'bottom' : 'none'}
          distanceOffset={10}
          items={showNav
            ? [<nav
              key="nav"
              className={clsx(
                'w-full flex items-center gap-1.5 sm:gap-2 bg-main',
                NAV_HEIGHT_CLASS,
                // Enlarge nav to ensure it fully masks underlying content
                'md:w-[calc(100%+8px)] md:translate-x-[-4px] md:px-[4px]',
                contentClassName,
              )}
              style={contentStyle}>
              {navInner}
            </nav>]
            : []}
        />
      }
    />
  );
};
