'use client';

import SwitcherItem from '@/components/switcher/SwitcherItem';
import {
  PATH_LIBRARY,
  PATH_HOME_INFERRED,
  isPathLibrary,
} from '@/app/path';
import IconSearch from '../components/icons/IconSearch';
import { useAppState } from '@/app/AppState';
import {
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
  NAV_SORT_CONTROL,
  MASONRY_GRID_ENABLED,
} from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import useKeydownHandler from '@/utility/useKeydownHandler';
import useDelayedLoading from '@/utility/useDelayedLoading';
import { usePathname, useRouter } from 'next/navigation';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { useAppText } from '@/i18n/state/client';
import { getSortStateFromPath } from '@/photo/sort/path';
import { motion } from 'framer-motion';
import IconLibrary from '@/components/icons/IconLibrary';
import AppViewMenu from './AppViewMenu';
import AppViewMenuCompact from './AppViewMenuCompact';
import getHomeViewNavState from './getHomeViewNavState';

export default function AppToolbar({
  className,
  animate = true,
  isInEmptyState,
}: {
  className?: string
  animate?: boolean
  isInEmptyState?: boolean
}) {
  const pathname = usePathname();
  
  const appText = useAppText();

  const {
    isUserSignedIn,
    isUserSignedInEager,
    setIsCommandKOpen,
    invalidateSwr,
    isPhotoSetFull,
    setIsPhotoSetFull,
  } = useAppState();

  const sortConfig = useMemo(
    () => getSortStateFromPath(pathname, appText),
    [pathname, appText],
  );

  const {
    sortBy,
    doesPathOfferSort,
    pathGrid,
    pathFull,
  } = sortConfig;

  const showSortControl =
    NAV_SORT_CONTROL !== 'none' &&
    doesPathOfferSort;

  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) {
      // After initial load, invalidate cache every time sort changes
      invalidateSwr?.();
    }
    hasLoadedRef.current = true;
  }, [invalidateSwr, sortBy]);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isViewSwitchLoading, setIsViewSwitchLoading] = useState(false);
  useDelayedLoading(isPending, setIsViewSwitchLoading);

  const refHrefLibrary = useRef<HTMLAnchorElement>(null);

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const {
    isPhotoSet,
    isOnFullPath,
    isOnGridPath,
    isViewFull,
    isViewGrid,
    hrefGrid,
    hrefFull,
    pathGridRoot,
    pathFullRoot,
  } = useMemo(() => getHomeViewNavState({
    pathname,
    isPhotoSetFull,
    pathGrid,
    pathFull,
  }), [pathname, isPhotoSetFull, pathGrid, pathFull]);

  // Compact view menu is for root + photo sets only (not /library, /admin/*)
  const showCompactViewMenu = isPhotoSet || isOnFullPath || isOnGridPath;

  const navigateHomeView = useCallback((
    view: 'grid' | 'full',
  ) => {
    const path = view === 'grid' ? pathGrid : pathFull;
    startTransition(() => router.push(path));
  }, [pathFull, pathGrid, router]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.metaKey) {
      switch (e.key.toLocaleUpperCase()) {
        case KEY_COMMANDS.full:
          if (isPhotoSet) {
            if (isPhotoSetFull) {
              startTransition(() => router.push(pathFullRoot));
            } else {
              setIsPhotoSetFull?.(true);
            }
          } else if (!isOnFullPath) {
            navigateHomeView('full');
          }
          break;
        case KEY_COMMANDS.grid:
          if (isPhotoSet) {
            if (!isPhotoSetFull) {
              startTransition(() => router.push(pathGridRoot));
            } else {
              setIsPhotoSetFull?.(false);
            }
          } else if (!isOnGridPath) {
            navigateHomeView('grid');
          }
          break;
        case KEY_COMMANDS.home:
          if (pathname !== PATH_HOME_INFERRED) {
            startTransition(() => router.push(PATH_HOME_INFERRED));
          }
          break;
        case KEY_COMMANDS.library:
          if (!isInEmptyState && pathname !== PATH_LIBRARY) {
            refHrefLibrary.current?.click();
          }
          break;
      }
    }
  }, [
    isInEmptyState,
    isPhotoSet,
    isPhotoSetFull,
    isOnFullPath,
    isOnGridPath,
    pathFullRoot,
    pathGridRoot,
    pathname,
    navigateHomeView,
    router,
    setIsPhotoSetFull,
  ]);
  useKeydownHandler({ onKeyDown });

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  return (
    <div className={clsx(
      className,
      'flex items-center shrink-0',
    )}>
      {!isInEmptyState &&
        <motion.div
          className="flex items-center"
          initial={animate ? { opacity: 0, x: -8 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          {showCompactViewMenu &&
            <AppViewMenuCompact
              className="sm:hidden"
              isViewFull={isViewFull}
              isViewGrid={isViewGrid}
              isMasonry={MASONRY_GRID_ENABLED}
              hrefGrid={hrefGrid}
              hrefFull={hrefFull}
              onSelectView={isPhotoSet ? setIsPhotoSetFull : undefined}
              isLoading={isViewSwitchLoading}
              showSortItems={showSortControl}
              sortConfig={sortConfig}
              isOpen={isViewMenuOpen}
              setIsOpen={isOpen => {
                setIsViewMenuOpen(isOpen);
                if (isOpen) {
                  setIsAdminMenuOpen(false);
                  setIsSortMenuOpen(false);
                }
              }}
            />}
          <AppViewMenu
            className="max-sm:hidden"
            isViewFull={isViewFull}
            isViewGrid={isViewGrid}
            isMasonry={MASONRY_GRID_ENABLED}
            hrefGrid={hrefGrid}
            hrefFull={hrefFull}
            onSelectView={isPhotoSet ? setIsPhotoSetFull : undefined}
            showSortControl={showSortControl}
            sortConfig={sortConfig}
            isSortMenuOpen={isSortMenuOpen}
            setIsSortMenuOpen={isOpen => {
              setIsSortMenuOpen(isOpen);
              if (isOpen) {
                setIsAdminMenuOpen(false);
                setIsViewMenuOpen(false);
              }
            }}
          />
        </motion.div>}
      {!isInEmptyState &&
        <SwitcherItem
          icon={<IconLibrary />}
          href={PATH_LIBRARY}
          hrefRef={refHrefLibrary}
          active={isPathLibrary(pathname)}
          naked
          width="narrow"
          noPadding
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: appText.nav.library,
            keyCommand: KEY_COMMANDS.library,
          }}}
        />}
      <SwitcherItem
        icon={<IconSearch />}
        onClick={() => setIsCommandKOpen?.(true)}
        naked
        width="narrow"
        noPadding
        tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
          content: appText.nav.search,
          keyCommandModifier: KEY_COMMANDS.search[0],
          keyCommand: KEY_COMMANDS.search[1],
        }}}
      />
      {/* Show spinner if admin is suspected to be logged in */}
      {(isUserSignedInEager && !isUserSignedIn) &&
        <SwitcherItem
          icon={<Spinner />}
          isInteractive={false}
          naked
          width="narrow"
          noPadding
          tooltip={{
            ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
              content: appText.nav.admin,
            },
          }}
        />}
      {isUserSignedIn &&
        <SwitcherItem
          icon={<AdminAppMenu
            isOpen={isAdminMenuOpen}
            setIsOpen={isOpen => {
              setIsAdminMenuOpen(isOpen);
              if (isOpen) {
                setIsSortMenuOpen(false);
                setIsViewMenuOpen(false);
              }
            }}
          />}
          iconIsFocusable
          active={isAdminMenuOpen}
          persistHover={isAdminMenuOpen}
          naked
          width="narrow"
          noPadding
          tooltip={{
            ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
              content: appText.nav.admin,
            },
          }}
        />}
    </div>
  );
}
