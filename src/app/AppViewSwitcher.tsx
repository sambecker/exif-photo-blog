import Switcher from '@/components/switcher/Switcher';
import SwitcherItem, { HEIGHT_CLASS } from '@/components/switcher/SwitcherItem';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import {
  PATH_ABOUT,
  PATH_FULL_INFERRED,
  PATH_GRID_INFERRED,
  PATH_ROOT,
  isPathHome,
  isPathPhotoSet,
} from '@/app/path';
import IconSearch from '../components/icons/IconSearch';
import { useAppState } from '@/app/AppState';
import {
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
  NAV_SORT_CONTROL,
  SHOW_ABOUT_PAGE,
  MASONRY_GRID_ENABLED,
} from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { usePathname, useRouter } from 'next/navigation';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { useAppText } from '@/i18n/state/client';
import IconSort from '@/components/icons/IconSort';
import { getSortStateFromPath } from '@/photo/sort/path';
import { motion } from 'framer-motion';
import SortMenu from '@/photo/sort/SortMenu';
import { SWR_KEYS } from '@/swr';
import IconAbout from '@/components/icons/IconAbout';
import IconGridMasonry from '@/components/icons/IconGridMasonry';
import SwitchPrimitive from '@/components/primitives/SwitchPrimitive';
import { BiHomeAlt as HomeIcon } from 'react-icons/bi';

export type SwitcherSelection = 'full' | 'grid' | 'about' | 'admin';

export default function AppViewSwitcher({
  currentSelection,
  className,
  animate = true,
  hideSortControl,
}: {
  currentSelection?: SwitcherSelection
  className?: string
  animate?: boolean
  hideSortControl?: boolean
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
    isSortedByDefault,
    isAscending,
    pathGrid,
    pathFull,
    pathSortToggle,
  } = sortConfig;

  const showSortControl =
    NAV_SORT_CONTROL !== 'none' &&
    doesPathOfferSort &&
    !hideSortControl;

  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) {
      // After initial load, invalidate cache every time sort changes
      invalidateSwr?.(SWR_KEYS.INFINITE_PHOTO_SCROLL);
    }
    hasLoadedRef.current = true;
  }, [invalidateSwr, sortBy]);

  const router = useRouter();

  const refHrefHome = useRef<HTMLAnchorElement>(null);
  const refHrefAbout = useRef<HTMLAnchorElement>(null);

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  
  // Home screens switch views by navigating, sets by toggling state
  const isHome = isPathHome(pathname);
  const isPhotoSet = isPathPhotoSet(pathname);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.metaKey) {
      switch (e.key.toLocaleUpperCase()) {
        case KEY_COMMANDS.full:
          if (isPhotoSet) {
            setIsPhotoSetFull?.(true);
          } else if (pathname !== PATH_FULL_INFERRED) {
            router.push(pathFull);
          }
          break;
        case KEY_COMMANDS.grid:
          if (isPhotoSet) {
            setIsPhotoSetFull?.(false);
          } else if (pathname !== PATH_GRID_INFERRED) {
            router.push(pathGrid);
          }
          break;
        case KEY_COMMANDS.home:
          if (pathname !== PATH_ROOT) { refHrefHome.current?.click(); }
          break;
        case KEY_COMMANDS.about:
          if (pathname !== PATH_ABOUT) { refHrefAbout.current?.click(); }
          break;
      }
    }
  }, [
    isPhotoSet,
    pathname,
    pathFull,
    pathGrid,
    router,
    setIsPhotoSetFull,
  ]);
  useKeydownHandler({ onKeyDown });

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const showViewSwitch = isHome || isPhotoSet;
  const isViewFull = isHome
    ? currentSelection === 'full'
    : isPhotoSetFull;

  return (
    <div className={clsx(className, 'flex', 'gap-2.5 sm:gap-4')}>
      <Switcher>
        <SwitcherItem
          icon={<HomeIcon size={17} />}
          href={PATH_ROOT}
          hrefRef={refHrefHome}
          active={isHome}
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: appText.nav.home,
            keyCommand: KEY_COMMANDS.home,
          }}}
        />
        {SHOW_ABOUT_PAGE &&
          <SwitcherItem
            icon={<IconAbout />}
            href={PATH_ABOUT}
            hrefRef={refHrefAbout}
            active={currentSelection === 'about'}
            tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
              content: appText.nav.about,
              keyCommand: KEY_COMMANDS.about,
            }}}
            noPadding
          />}
        <SwitcherItem
          icon={<IconSearch />}
          onClick={() => setIsCommandKOpen?.(true)}
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: appText.nav.search,
            keyCommandModifier: KEY_COMMANDS.search[0],
            keyCommand: KEY_COMMANDS.search[1],
          }}}
          noPadding
        />
        {/* Show spinner if admin is suspected to be logged in */}
        {(isUserSignedInEager && !isUserSignedIn) &&
          <SwitcherItem
            icon={<Spinner />}
            isInteractive={false}
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
                if (isOpen) { setIsSortMenuOpen(false); }
              }}
            />}
            tooltip={{
              ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                content: appText.nav.admin,
              },
            }}
            noPadding
          />}
      </Switcher>
      <motion.div
        initial={animate ? { opacity: 0, width: 0 } : false}
        animate={{
          opacity: showViewSwitch ? 1 : 0,
          width: showViewSwitch ? 'auto' : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <SwitchPrimitive
          checked={!isViewFull}
          onCheckedChange={isGrid => {
            if (isHome) {
              // Sort-aware paths retain the active sort while switching views
              router.push(isGrid ? pathGrid : pathFull);
            } else {
              setIsPhotoSetFull?.(!isGrid);
            }
          }}
          label={isViewFull ? appText.nav.viewGrid : appText.nav.viewFull}
          className={clsx(
            HEIGHT_CLASS,
            '-mr-3',
          )}
          accessoryStart={MASONRY_GRID_ENABLED && isHome
            ? <IconGridMasonry />
            : <IconGrid />}
          accessoryEnd={<IconFull />}
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: isViewFull
              ? appText.nav.viewGrid
              : appText.nav.viewFull,
            keyCommand: isViewFull
              ? KEY_COMMANDS.grid
              : KEY_COMMANDS.full,
          }}}
        />
      </motion.div>
      <motion.div
        className="overflow-hidden"
        initial={animate ? { opacity: 0, width: 0 } : false}
        animate={{
          opacity: showSortControl ? 1 : 0,
          width: showSortControl ? 'auto' : 0,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Switcher
          className={clsx('max-sm:hidden')}
          type="borderless"
        >
          {NAV_SORT_CONTROL === 'menu'
            ? <SwitcherItem
              className={clsx(
                !isSortedByDefault && '*:bg-medium *:text-main!',
              )}
              icon={<SortMenu
                {...sortConfig}
                isOpen={isSortMenuOpen}
                setIsOpen={isOpen => {
                  setIsSortMenuOpen(isOpen);
                  if (isOpen) { setIsAdminMenuOpen(false); }
                }}
              />}
              tooltip={{
                ...!isSortMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                  content: appText.sort.sort,
                },
              }}
              width="narrow"
              noPadding
            />
            : <SwitcherItem
              className={clsx(
                '*:w-full *:h-full *:flex *:items-center *:justify-center',
                !isSortedByDefault && '*:bg-medium *:text-main!',
              )}
              href={pathSortToggle}
              icon={<IconSort
                sort={isAscending ? 'asc' : 'desc'}
                className="translate-x-[0.5px] translate-y-px"
              />}
              tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                content: isAscending
                  ? appText.sort.viewNewest
                  : appText.sort.viewOldest,
              }}}
              width="narrow"
              noPadding
            />}
        </Switcher>
      </motion.div>
    </div>
  );
}
