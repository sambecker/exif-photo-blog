'use client';


/* eslint-disable max-len */

import { clsx } from 'clsx/lite';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppGrid from '@/components/AppGrid';
import AppViewSwitcher, { SwitcherSelection } from '@/app/AppViewSwitcher';
import {
  PATH_ROOT,
  isPathAdmin,
  isPathFull,
  isPathGrid,
  isPathProtected,
  isPathSignIn,
  isPathSelected,
  PATH_SELECTED,
} from '@/app/path';
import AnimateItems from '../components/AnimateItems';
import {
  GRID_HOMEPAGE_ENABLED,
  NAV_CAPTION,
} from './config';
import { useRef } from 'react';
import useStickyNav from './useStickyNav';
import { useAppState } from '@/app/AppState';
import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import { useSelection } from '@/selection/SelectionContext';
import { useSession, signOut } from 'next-auth/react';
import AdminAppMenu from '@/admin/AdminAppMenu';
import { toast } from 'sonner';
import { useLanguage } from '@/i18n/state/LanguageContext';
import { useAppText } from '@/i18n/state/client';


const NAV_HEIGHT_CLASS = NAV_CAPTION
  ? 'min-h-[4rem] sm:min-h-[5rem]'
  : 'min-h-[4rem]';

export default function NavClient({
  navTitle,
  navCaption,
  animate,
}: {
  navTitle: string
  navCaption?: string
  animate: boolean
}) {
  const ref = useRef<HTMLElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const showNav = !isPathSignIn(pathname);

  const { status } = useSession();
  const {
    hasLoadedWithAnimations,
    isUserSignedIn,
    isUserSignedInEager,
    isUserAdmin,
    isCheckingAuth: _isCheckingAuth,
    clearAuthStateAndRedirectIfNecessary,
  } = useAppState();

  const {
    selectionMode,
    toggleSelectionMode,
    selectedPhotos,
    confirmSelection,
    clearSelection,
  } = useSelection();

  const { locale, setLocale } = useLanguage();
  const appText = useAppText();

  const {
    classNameStickyContainer,
    classNameStickyNav,
    isNavVisible,
  } = useStickyNav(ref, !isPathAdmin(pathname));

  const renderLink = (
    text: string,
    linkOrAction: string | (() => void),
  ) =>
    typeof linkOrAction === 'string'
      ? <Link href={linkOrAction}>{text}</Link>
      : <button onClick={linkOrAction} type="button">{text}</button>;

  const switcherSelectionForPath = (): SwitcherSelection | undefined => {
    if (pathname === PATH_ROOT) {
      return GRID_HOMEPAGE_ENABLED ? 'grid' : 'full';
    } else if (isPathGrid(pathname)) {
      return 'grid';
    } else if (isPathFull(pathname)) {
      return 'full';
    } else if (isPathProtected(pathname)) {
      return 'admin';
    }
  };

  return (
    <AppGrid
      className={classNameStickyContainer}
      classNameMain='pointer-events-auto'
      contentMain={
        <AnimateItems
          animateOnFirstLoadOnly
          type={animate && !isPathAdmin(pathname) ? 'bottom' : 'none'}
          distanceOffset={10}
          items={showNav
            ? [<nav
              key="nav"
              ref={ref}
              className={clsx(
                'w-full flex items-center bg-main z-10',
                NAV_HEIGHT_CLASS,
                classNameStickyNav,
              )}>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <AppViewSwitcher
                  currentSelection={switcherSelectionForPath()}
                />
                {isUserAdmin &&
                  <div className="relative">
                    <AdminAppMenu />
                  </div>
                }
                {/* Selection Buttons - Hidden on mobile */}
                {status !== 'loading' && selectionMode && status === 'authenticated' ? (
                  <div className="hidden sm:flex items-center">
                    <Switcher type="borderless">
                      <SwitcherItem
                        className="px-3"
                        width="auto"
                        noPadding
                        icon={<span>{appText.selected.confirm}</span>}
                        onClick={async () => {
                          const success = await confirmSelection();
                          if (success) {
                            router.refresh();
                            router.push(PATH_SELECTED);
                          }
                        }}
                        tooltip={{
                          content: appText.selected.confirmTooltip,
                        }}
                      />
                      <SwitcherItem
                        className="px-3"
                        width="auto"
                        noPadding
                        icon={<span>{appText.selected.cancel}</span>}
                        onClick={() => {
                          clearSelection();
                          router.refresh();
                        }}
                        tooltip={{
                          content: appText.selected.cancelTooltip,
                        }}
                      />
                    </Switcher>
                    <span className="text-dim ml-1 whitespace-nowrap">({selectedPhotos.length})</span>
                  </div>
                ) : (
                  status !== 'loading' && status === 'authenticated' && !isPathSelected(pathname) && (
                    <Switcher type="borderless" className="hidden sm:flex">
                      <SwitcherItem
                        className="px-3"
                        width="auto"
                        noPadding
                        icon={<span>{appText.selected.select}</span>}
                        onClick={() => toggleSelectionMode()}
                        tooltip={{
                          content: appText.selected.selectTooltip,
                        }}
                      />
                    </Switcher>
                  )
                )}
                {/* View Selections Button - only visible when not in selectionMode and photos are selected - Hidden on mobile */}
                {!selectionMode && selectedPhotos.length > 0 && status === 'authenticated' && (
                  <Switcher type="borderless" className="hidden sm:flex">
                    <SwitcherItem
                      icon={<span className="whitespace-nowrap">{appText.selected.selectedItem} ({selectedPhotos.length})</span>}
                      href={PATH_SELECTED}
                      onClick={() => toast.info(appText.selected.redirecting)}
                      tooltip={{
                        content: appText.selected.viewSelections,
                      }}
                      width="narrow"
                    />
                  </Switcher>
                )}
              </div>
              <div className={clsx(
                'grow text-right min-w-0',
                'translate-y-[-1px]',
                'ml-4 sm:ml-6',
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
              {/* Language Toggle */}
              <div className="ml-3 sm:ml-4">
                <button
                  onClick={() => setLocale(locale === 'es-ar' ? 'en-us' : 'es-ar')}
                  className={clsx(
                    'font-mono link h-4 active:text-medium',
                    'disabled:bg-transparent! hover:text-dim',
                    'inline-flex items-center gap-1.5 self-start',
                    'whitespace-nowrap focus:outline-hidden text-medium',
                  )}
                  title={appText.nav.language}
                >
                  <span className="hidden sm:inline">
                    {locale === 'es-ar'
                      ? appText.nav.languageEn
                      : appText.nav.languageEs}
                  </span>
                  <span className="sm:hidden">
                    {locale === 'es-ar' ? 'EN' : 'ES'}
                  </span>
                </button>
              </div>
              {/* Sign-in/Sign-out Button */}
              {!(isUserSignedIn || isUserSignedInEager) ? (
                <div className="ml-3 sm:ml-4">
                  <Link
                    href="/sign-in"
                    className={clsx(
                      'font-mono link h-4 active:text-medium',
                      'disabled:bg-transparent! hover:text-dim',
                      'inline-flex items-center gap-1.5 self-start',
                      'whitespace-nowrap focus:outline-hidden text-medium',
                    )}
                  >
                    <span className="hidden sm:inline">{appText.auth.signIn}</span>
                    <span className="sm:hidden">-</span>
                  </Link>
                </div>
              ) : (
                <div className="ml-3 sm:ml-4">
                  <button
                    onClick={() => clearAuthStateAndRedirectIfNecessary?.()}
                    className={clsx(
                      'font-mono link h-4 active:text-medium',
                      'disabled:bg-transparent! hover:text-dim',
                      'inline-flex items-center gap-1.5 self-start',
                      'whitespace-nowrap focus:outline-hidden text-medium',
                    )}
                  >
                    <span className="hidden sm:inline">{appText.auth.signOut}</span>
                    <span className="sm:hidden">-</span>
                  </button>
                </div>
              )}
              {/* Admin Button */}
              {isUserAdmin && (
                <div className="ml-3 sm:ml-4">
                  <Link
                    href="/admin/photos"
                    className={clsx(
                      'font-mono link h-4 active:text-medium',
                      'disabled:bg-transparent! hover:text-dim',
                      'inline-flex items-center gap-1.5 self-start',
                      'whitespace-nowrap focus:outline-hidden text-medium',
                    )}
                  >
                    <span className="hidden sm:inline">Admin</span>
                    <span className="sm:hidden">A</span>
                  </Link>
                </div>
              )}
            </nav>]
            : []}
        />
      }
    />
  );
}
