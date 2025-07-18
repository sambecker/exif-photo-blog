import Switcher from '@/components/switcher/Switcher';
import SwitcherItem from '@/components/switcher/SwitcherItem';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import {
  PATH_FULL_INFERRED,
  PATH_GRID_INFERRED,
} from '@/app/path';
import IconSearch from '../components/icons/IconSearch';
import { useAppState } from '@/app/AppState';
import {
  GRID_HOMEPAGE_ENABLED,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
  NAV_SORT_CONTROL,
} from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { usePathname } from 'next/navigation';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { useAppText } from '@/i18n/state/client';
import IconSort from '@/components/icons/IconSort';
import { getSortStateFromPath } from '@/photo/sort/path';
import { motion } from 'framer-motion';
import SortMenu from '@/photo/sort/SortMenu';
import { SWR_KEYS } from '@/swr';

export type SwitcherSelection = 'full' | 'grid' | 'admin';

const GAP_CLASS_RIGHT = 'mr-1.5 sm:mr-2';
const GAP_CLASS_LEFT  = 'ml-0.5 sm:ml-1';

export default function AppViewSwitcher({
  currentSelection,
  className,
  animate = true,
}: {
  currentSelection?: SwitcherSelection
  className?: string
  animate?: boolean
}) {
  const pathname = usePathname();
  
  const appText = useAppText();

  const {
    isUserSignedIn,
    isUserSignedInEager,
    setIsCommandKOpen,
    invalidateSwr,
  } = useAppState();

  const sortConfig = useMemo(() => getSortStateFromPath(pathname), [pathname]);

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
    doesPathOfferSort;

  const hasLoadedRef = useRef(false);
  useEffect(() => {
    if (hasLoadedRef.current) {
      // After initial load, invalidate cache every time sort changes
      invalidateSwr?.(SWR_KEYS.INFINITE_PHOTO_SCROLL);
    }
    hasLoadedRef.current = true;
  }, [invalidateSwr, sortBy]);

  const refHrefFull = useRef<HTMLAnchorElement>(null);
  const refHrefGrid = useRef<HTMLAnchorElement>(null);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.metaKey) {
      switch (e.key.toLocaleUpperCase()) {
      case KEY_COMMANDS.full:
        if (pathname !== PATH_FULL_INFERRED) { refHrefFull.current?.click(); }
        break;
      case KEY_COMMANDS.grid:
        if (pathname !== PATH_GRID_INFERRED) { refHrefGrid.current?.click(); }
        break;
      case KEY_COMMANDS.admin:
        if (isUserSignedIn) { setIsAdminMenuOpen(true); }
        break;
      }
    }
  }, [pathname, isUserSignedIn]);
  useKeydownHandler({ onKeyDown });

  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const renderItemFull =
    <SwitcherItem
      icon={<IconFull includeTitle={false} />}
      href={pathFull}
      hrefRef={refHrefFull}
      active={currentSelection === 'full'}
      tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: appText.nav.full,
        keyCommand: KEY_COMMANDS.full,
      }}}
      noPadding
    />;

  const renderItemGrid =
    <SwitcherItem
      icon={<IconGrid includeTitle={false} />}
      href={pathGrid}
      hrefRef={refHrefGrid}
      active={currentSelection === 'grid'}
      tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: appText.nav.grid,
        keyCommand: KEY_COMMANDS.grid,
      }}}
      noPadding
    />;

  return (
    <div className={clsx('flex', className)}>
      <Switcher
        className={clsx(
          GAP_CLASS_RIGHT,
          // Apply offset due to outline strategy
          'translate-x-[1px]',
        )}
      >
        {GRID_HOMEPAGE_ENABLED ? renderItemGrid : renderItemFull}
        {GRID_HOMEPAGE_ENABLED ? renderItemFull : renderItemGrid}
        {/* Show spinner if admin is suspected to be logged in */}
        {(isUserSignedInEager && !isUserSignedIn) &&
          <SwitcherItem
            icon={<Spinner />}
            isInteractive={false}
            noPadding
            tooltip={{
              ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                content: appText.nav.admin,
                keyCommand: KEY_COMMANDS.admin,
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
                keyCommand: KEY_COMMANDS.admin,
              },
            }}
            noPadding
          />}
      </Switcher>
      {showSortControl &&
        <motion.div
          initial={animate ? { opacity: 0, scale: 0.5 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Switcher
            className={clsx('max-sm:hidden', GAP_CLASS_LEFT)}
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
                  className="translate-x-[0.5px] translate-y-[1px]"
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
        </motion.div>}
      <motion.div
        // Conditional key necessary to halt/resume layout animations
        key={animate ? 'search' : 'search-no-animate'}
        layout={animate}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      >
        <Switcher type="borderless">
          <SwitcherItem
            icon={<IconSearch includeTitle={false} />}
            onClick={() => setIsCommandKOpen?.(true)}
            tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
              content: appText.nav.search,
              keyCommandModifier: KEY_COMMANDS.search[0],
              keyCommand: KEY_COMMANDS.search[1],
            }}}
            width="narrow"
          />
        </Switcher>
      </motion.div>
    </div>
  );
}
