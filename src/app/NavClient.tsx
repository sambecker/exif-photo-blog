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
    <AppGrid
      containerRef={ref}
      className={containerClassName}
      style={containerStyle}
      classNameMain='pointer-events-auto'
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
            </nav>]
            : []}
        />
      }
    />
  );
};
