'use client';

import SwitcherItem from '@/components/switcher/SwitcherItem';
import IconFull from '@/components/icons/IconFull';
import IconFloating from '@/components/icons/IconFloating';
import IconGrid from '@/components/icons/IconGrid';
import IconGridMasonry from '@/components/icons/IconGridMasonry';
import SortMenu from '@/photo/sort/SortMenu';
import { getSortStateFromPath } from '@/photo/sort/path';
import { useAppText } from '@/i18n/state/client';
import { KEY_COMMANDS } from '@/photo/key-commands';
import clsx from 'clsx/lite';
import {
  GRID_HOMEPAGE_ENABLED,
  NAV_SORT_CONTROL,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
} from './config';
import IconSortNav from '@/components/icons/IconSortNav';

export default function AppViewMenu({
  isViewFull,
  isViewFloating,
  isMasonry,
  // Home views switch by navigating, sets by toggling state
  hrefGrid,
  hrefFull,
  hrefFloating,
  onSelectView,
  showSortControl,
  sortConfig,
  isSortMenuOpen,
  setIsSortMenuOpen,
  className,
}: {
  isViewFull?: boolean
  isViewFloating?: boolean
  isMasonry?: boolean
  hrefGrid?: string
  hrefFull?: string
  hrefFloating?: string
  onSelectView?: (isFull: boolean) => void
  showSortControl?: boolean
  sortConfig: ReturnType<typeof getSortStateFromPath>
  isSortMenuOpen?: boolean
  setIsSortMenuOpen?: (isOpen: boolean) => void
  className?: string
}) {
  const appText = useAppText();

  const {
    isSortedByDefault,
    isAscending,
    isColor,
    pathSortToggle,
  } = sortConfig;

  const isViewGrid = !isViewFull && !isViewFloating;

  const switcherItemGrid = <SwitcherItem
    key="grid"
    icon={isMasonry
      ? <IconGridMasonry />
      : <IconGrid />}
    href={hrefGrid}
    onClick={hrefGrid
      ? undefined
      : () => onSelectView?.(false)}
    active={isViewGrid}
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
    href={hrefFull}
    onClick={hrefFull
      ? undefined
      : () => onSelectView?.(true)}
    active={Boolean(isViewFull)}
    tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
      content: appText.nav.full,
      keyCommand: KEY_COMMANDS.full,
    }}}
    width="narrow"
    noPadding
  />;

  const switcherItemFloating = hrefFloating
    ? <SwitcherItem
      key="floating"
      icon={<IconFloating />}
      href={hrefFloating}
      active={Boolean(isViewFloating)}
      tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: appText.nav.floating,
        keyCommand: KEY_COMMANDS.floating,
      }}}
      width="narrow"
      noPadding
    />
    : null;

  const viewItems = GRID_HOMEPAGE_ENABLED
    ? [switcherItemGrid, switcherItemFull, switcherItemFloating]
    : [switcherItemFull, switcherItemGrid, switcherItemFloating];

  return (
    <div
      className={clsx(
        className,
        'flex items-center',
        '*:rounded-lg *:overflow-hidden',
      )}
    >
      {viewItems}
      {showSortControl && (NAV_SORT_CONTROL === 'menu'
        ? <SwitcherItem
          className={clsx(
            !isSortedByDefault && '*:bg-dim *:text-main!',
          )}
          icon={<SortMenu
            {...sortConfig}
            isOpen={isSortMenuOpen}
            setIsOpen={setIsSortMenuOpen}
          />}
          iconIsFocusable
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
            !isSortedByDefault && '*:bg-dim *:text-main!',
          )}
          href={pathSortToggle}
          icon={<IconSortNav
            sort={isAscending ? 'asc' : 'desc'}
            chromatic={isColor}
          />}
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: isAscending
              ? appText.sort.viewNewest
              : appText.sort.viewOldest,
          }}}
          width="narrow"
          noPadding
        />)}
    </div>
  );
}
