import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import IconGridMasonry from '@/components/icons/IconGridMasonry';
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
  GRID_HOMEPAGE_ENABLED,
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
import IconSort from '@/components/icons/IconSort';
import { getSortStateFromPath } from '@/photo/sort/path';
import { motion } from 'framer-motion';
import SortMenu from '@/photo/sort/SortMenu';
import { SWR_KEYS } from '@/swr';
import IconAbout from '@/components/icons/IconAbout';
import { BiHomeAlt as HomeIcon } from 'react-icons/bi';
import AppViewMenu from './AppViewMenu';

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
  const [isPending, startTransition] = useTransition();
  const [isViewSwitchLoading, setIsViewSwitchLoading] = useState(false);
  useDelayedLoading(isPending, setIsViewSwitchLoading);

  const refHrefHome = useRef<HTMLAnchorElement>(null);
  const refHrefAbout = useRef<HTMLAnchorElement>(null);

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  
  // Home screens switch views by navigating, sets by toggling state
  const isHome = isPathHome(pathname);
  const isPhotoSet = isPathPhotoSet(pathname);

  const navigateHomeView = useCallback((isGrid: boolean) => {
    const path = isGrid ? pathGrid : pathFull;
    startTransition(() => router.push(path));
  }, [pathFull, pathGrid, router]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.metaKey) {
      switch (e.key.toLocaleUpperCase()) {
        case KEY_COMMANDS.full:
          if (isPhotoSet) {
            setIsPhotoSetFull?.(true);
          } else if (pathname !== PATH_FULL_INFERRED) {
            navigateHomeView(false);
          }
          break;
        case KEY_COMMANDS.grid:
          if (isPhotoSet) {
            setIsPhotoSetFull?.(false);
          } else if (pathname !== PATH_GRID_INFERRED) {
            navigateHomeView(true);
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
    navigateHomeView,
    setIsPhotoSetFull,
  ]);
  useKeydownHandler({ onKeyDown });

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const showViewSwitch = isHome || isPhotoSet;
  const isViewFull = isHome
    ? currentSelection === 'full'
    : isPhotoSetFull;

  const switcherItemGrid = <SwitcherItem
    key="grid"
    icon={MASONRY_GRID_ENABLED && isHome
      ? <IconGridMasonry />
      : <IconGrid />}
    href={isHome ? pathGrid : undefined}
    onClick={isHome
      ? undefined
      : () => setIsPhotoSetFull?.(false)}
    active={!isViewFull}
    tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
      content: appText.nav.grid,
      keyCommand: KEY_COMMANDS.grid,
    }}}
    width="narrow"
    noPadding
  />;

  const switcherItemFull = <SwitcherItem
    key="full"
    icon={<IconFull />}
    href={isHome ? pathFull : undefined}
    onClick={isHome
      ? undefined
      : () => setIsPhotoSetFull?.(true)}
    active={isViewFull}
    tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
      content: appText.nav.full,
      keyCommand: KEY_COMMANDS.full,
    }}}
    width="narrow"
    noPadding
  />;

  return (
    <div className={clsx(className, 'flex')}>
      <Switcher className="mr-2.5 sm:mr-4">
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
                if (isOpen) {
                  setIsSortMenuOpen(false);
                  setIsViewMenuOpen(false);
                }
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
        <AppViewMenu
          className="sm:hidden"
          isViewFull={isViewFull}
          isMasonry={MASONRY_GRID_ENABLED && isHome}
          // Sort-aware paths retain the active sort while switching views
          hrefGrid={isHome ? pathGrid : undefined}
          hrefFull={isHome ? pathFull : undefined}
          onSelectView={setIsPhotoSetFull}
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
        />
        <Switcher
          className="max-sm:hidden"
          type="borderless"
          divide={false}
        >
          {GRID_HOMEPAGE_ENABLED
            ? [switcherItemGrid, switcherItemFull]
            : [switcherItemFull, switcherItemGrid]}
          {NAV_SORT_CONTROL === 'menu'
            ? <SwitcherItem
              className={clsx(
                !isSortedByDefault && '*:bg-dim *:text-main!',
              )}
              icon={<SortMenu
                {...sortConfig}
                isOpen={isSortMenuOpen}
                setIsOpen={isOpen => {
                  setIsSortMenuOpen(isOpen);
                  if (isOpen) {
                    setIsAdminMenuOpen(false);
                    setIsViewMenuOpen(false);
                  }
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
