'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import { FiChevronDown } from 'react-icons/fi';
import MoreMenu, { MoreMenuSection } from '@/components/more/MoreMenu';
import { renderMenuItemCheck } from '@/components/more/MoreMenuItem';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import IconGridMasonry from '@/components/icons/IconGridMasonry';
import Spinner from '@/components/Spinner';
import Tooltip from '@/components/Tooltip';
import {
  HEIGHT_CLASS,
  NAV_ITEM_INTERACTIVE_BG,
} from '@/components/switcher/SwitcherItem';
import { useAppText } from '@/i18n/state/client';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { getSortStateFromPath } from '@/photo/sort/path';
import { getSortMenuItems } from '@/photo/sort/menu';
import {
  GRID_HOMEPAGE_ENABLED,
  NAV_SORT_CONTROL,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
} from './config';
import { PATH_LIBRARY } from './path';
import IconSortNav from '@/components/icons/IconSortNav';
import IconLibrary from '@/components/icons/IconLibrary';

export default function AppViewMenuCompact({
  isViewFull,
  isViewGrid,
  isViewLibrary,
  isMasonry,
  // Sets toggle via onSelectView; elsewhere navigate via hrefs
  hrefGrid,
  hrefFull,
  onSelectView,
  isLoading,
  showSortItems,
  sortConfig,
  isOpen,
  setIsOpen,
  className,
}: {
  isViewFull?: boolean
  isViewGrid?: boolean
  isViewLibrary?: boolean
  isMasonry?: boolean
  hrefGrid?: string
  hrefFull?: string
  onSelectView?: (isFull: boolean) => void
  isLoading?: boolean
  showSortItems?: boolean
  sortConfig: ReturnType<typeof getSortStateFromPath>
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  className?: string
}) {
  const appText = useAppText();

  const renderIconGrid = (selected?: boolean) => isMasonry
    ? <IconGridMasonry selected={selected} />
    : <IconGrid selected={selected} />;

  // Selected views are marked with a check, unselected show their own icon
  const renderViewIcon = (icon: ReactNode, isSelected?: boolean) =>
    isSelected ? renderMenuItemCheck(true) : icon;

  const itemGrid = {
    label: appText.nav.grid,
    icon: renderViewIcon(renderIconGrid(isViewGrid), isViewGrid),
    iconWide: true,
    ...hrefGrid
      ? { href: hrefGrid }
      : { action: () => onSelectView?.(false) },
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.grid },
  };

  const itemFull = {
    label: appText.nav.full,
    icon: renderViewIcon(
      <IconFull selected={isViewFull} />,
      isViewFull,
    ),
    iconWide: true,
    ...hrefFull
      ? { href: hrefFull }
      : { action: () => onSelectView?.(true) },
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.full },
  };

  const itemLibrary = {
    label: appText.nav.library,
    icon: renderViewIcon(
      <IconLibrary selected={isViewLibrary} />,
      isViewLibrary,
    ),
    iconWide: true,
    href: PATH_LIBRARY,
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.library },
  };

  const viewItems: MoreMenuSection['items'] = [
    ...GRID_HOMEPAGE_ENABLED
      ? [itemGrid, itemFull]
      : [itemFull, itemGrid],
    itemLibrary,
  ];

  // Full color when a view is active or the menu is open.
  // Photo detail / admin stay dim with nothing checked.
  const isViewActive = isViewFull || isViewGrid || isViewLibrary;

  const sections: MoreMenuSection[] = [{ items: viewItems }];

  if (showSortItems) {
    const { itemsSortOrder, itemsSortType } =
      getSortMenuItems(sortConfig, appText);
    sections.push({
      items: [{
        label: appText.sort.sort,
        icon: <IconSortNav
          sort={sortConfig.isAscending ? 'asc' : 'desc'}
          chromatic={sortConfig.isColor}
        />,
        iconWide: true,
        // Sort types are only offered where the nav exposes a full sort menu.
        // Submenu items are check-only — keep default (narrow) icon slots.
        sections: NAV_SORT_CONTROL === 'menu'
          ? [{ items: itemsSortOrder }, { items: itemsSortType }]
          : [{ items: itemsSortOrder }],
      }],
    });
  }

  const renderTriggerIcon = () => {
    if (isLoading) { return <Spinner />; }
    if (isViewFull) { return <IconFull selected />; }
    if (isViewGrid) { return renderIconGrid(true); }
    if (isViewLibrary) { return <IconLibrary selected />; }
    // Non-view pages: top menu item, unselected
    return GRID_HOMEPAGE_ENABLED
      ? renderIconGrid(false)
      : <IconFull />;
  };

  return (
    <Tooltip
      classNameTrigger={className}
      delayDuration={500}
      triggerIsFocusable
      {...!isOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: appText.nav.viewOptions,
      }}
    >
      <div className={clsx(
        'flex items-center',
        HEIGHT_CLASS,
      )}>
        <MoreMenu
          {...{ isOpen, setIsOpen }}
          sections={sections}
          ariaLabel="View Menu"
          align="end"
          sideOffset={10}
          alignOffset={4}
          icon={<>
            <span className="flex items-center justify-center w-8 h-6">
              {renderTriggerIcon()}
            </span>
            <FiChevronDown
              size={13}
              className="shrink-0 -ml-1.5 text-dim"
            />
          </>}
          classNameButton={clsx(
            'inline-flex items-center',
            HEIGHT_CLASS,
            'rounded-md',
            isViewActive || isOpen
              ? 'text-main!'
              : 'text-gray-400! dark:text-gray-600!',
            !isViewActive && !isOpen &&
              'hover:text-gray-700! dark:hover:text-gray-400!',
            NAV_ITEM_INTERACTIVE_BG,
            'cursor-pointer',
          )}
          classNameButtonOpen="bg-dim! text-main!"
        />
      </div>
    </Tooltip>
  );
}
