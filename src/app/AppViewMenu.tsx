'use client';

import SwitcherItem from '@/components/switcher/SwitcherItem';
import IconFull from '@/components/icons/IconFull';
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
  isViewGrid,
  isMasonry,
  // Sets toggle via onSelectView; elsewhere navigate via hrefs
  hrefGrid,
  hrefFull,
  onSelectView,
  showSortControl,
  sortConfig,
  isSortMenuOpen,
  setIsSortMenuOpen,
  className,
}: {
  isViewFull?: boolean
  isViewGrid?: boolean
  isMasonry?: boolean
  hrefGrid?: string
  hrefFull?: string
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

  const switcherItemGrid = <SwitcherItem
    key="grid"
    icon={isMasonry
      ? <IconGridMasonry />
      : <IconGrid />}
    href={hrefGrid}
    onClick={hrefGrid
      ? undefined
      : () => onSelectView?.(false)}
    active={Boolean(isViewGrid)}
    naked
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
    naked
    tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
      content: appText.nav.full,
      keyCommand: KEY_COMMANDS.full,
    }}}
    width="narrow"
    noPadding
  />;

  const viewItems = GRID_HOMEPAGE_ENABLED
    ? [switcherItemGrid, switcherItemFull]
    : [switcherItemFull, switcherItemGrid];

  const sortItem = showSortControl
    ? (NAV_SORT_CONTROL === 'menu'
      ? <SwitcherItem
        key="sort"
        icon={<SortMenu
          {...sortConfig}
          isOpen={isSortMenuOpen}
          setIsOpen={setIsSortMenuOpen}
        />}
        iconIsFocusable
        active={!isSortedByDefault}
        naked
        tooltip={{
          ...!isSortMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: appText.sort.sort,
          },
        }}
        width="narrow"
        noPadding
      />
      : <SwitcherItem
        key="sort"
        href={pathSortToggle}
        icon={<IconSortNav
          sort={isAscending ? 'asc' : 'desc'}
          chromatic={isColor}
        />}
        active={!isSortedByDefault}
        naked
        tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
          content: isAscending
            ? appText.sort.viewNewest
            : appText.sort.viewOldest,
        }}}
        width="narrow"
        noPadding
      />)
    : null;

  return (
    <div
      className={clsx(
        className,
        'flex items-center',
      )}
    >
      {/* Sort first to match nav sketch: sort, views, library, search */}
      {sortItem}
      {viewItems}
    </div>
  );
}
