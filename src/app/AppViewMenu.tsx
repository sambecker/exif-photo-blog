'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx/lite';
import { FiChevronDown } from 'react-icons/fi';
import MoreMenu, { MoreMenuSection } from '@/components/more/MoreMenu';
import {
  renderMenuItemCheck,
  renderMenuItemLabel,
} from '@/components/more/MoreMenuItem';
import IconFull from '@/components/icons/IconFull';
import IconGrid from '@/components/icons/IconGrid';
import IconGridMasonry from '@/components/icons/IconGridMasonry';
import IconSort from '@/components/icons/IconSort';
import Spinner from '@/components/Spinner';
import Tooltip from '@/components/Tooltip';
import { HEIGHT_CLASS } from '@/components/switcher/SwitcherItem';
import { useAppText } from '@/i18n/state/client';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { getSortStateFromPath } from '@/photo/sort/path';
import { getSortMenuItems } from '@/photo/sort/menu';
import {
  GRID_HOMEPAGE_ENABLED,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
} from './config';

const ICON_WIDTH_MENU = 22;

export default function AppViewMenu({
  isViewFull,
  isMasonry,
  // Home views switch by navigating, sets by toggling state
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

  const renderIconGrid = (width?: number) => isMasonry
    ? <IconGridMasonry width={width} />
    : <IconGrid width={width} />;

  // Selected views are marked with a check, unselected show their own icon
  const renderViewIcon = (icon: ReactNode, isSelected: boolean) => isSelected
    ? renderMenuItemCheck(true)
    : icon;

  const itemGrid = {
    ...renderMenuItemLabel(appText.nav.grid, !isViewFull),
    icon: renderViewIcon(renderIconGrid(ICON_WIDTH_MENU), !isViewFull),
    ...hrefGrid
      ? { href: hrefGrid }
      : { action: () => onSelectView?.(false) },
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.grid },
  };

  const itemFull = {
    ...renderMenuItemLabel(appText.nav.full, Boolean(isViewFull)),
    icon: renderViewIcon(
      <IconFull width={ICON_WIDTH_MENU} />,
      Boolean(isViewFull),
    ),
    ...hrefFull
      ? { href: hrefFull }
      : { action: () => onSelectView?.(true) },
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.full },
  };

  const items: MoreMenuSection['items'] = GRID_HOMEPAGE_ENABLED
    ? [itemGrid, itemFull]
    : [itemFull, itemGrid];

  if (showSortItems) {
    const { itemsSortOrder, itemsSortType } =
      getSortMenuItems(sortConfig, appText);
    items.push({
      label: appText.sort.sort,
      icon: <IconSort
        size={15}
        sort={sortConfig.isAscending ? 'asc' : 'desc'}
        className="translate-x-[-1px] translate-y-[1px]"
      />,
      items: itemsSortOrder.concat(itemsSortType),
    });
  }

  const menu = <div className={clsx(
    'flex items-center',
    HEIGHT_CLASS,
  )}>
    <MoreMenu
      {...{ isOpen, setIsOpen }}
      sections={[{ items }]}
      ariaLabel="View Menu"
      align="start"
      sideOffset={10}
      alignOffset={-4}
      icon={<>
        <span className="flex items-center justify-center">
          {isLoading
            ? <Spinner />
            : isViewFull
              ? <IconFull />
              : renderIconGrid()}
        </span>
        <FiChevronDown
          size={13}
          className="shrink-0 -ml-1"
        />
      </>}
      classNameButton={clsx(
        'inline-flex items-center',
        'h-[28px]',
        'rounded-full',
        'text-main!',
        'hover:bg-extra-dim! active:bg-dim!',
        'cursor-pointer',
      )}
      classNameButtonOpen="bg-dim!"
    />
  </div>;

  return (
    <Tooltip
      classNameTrigger={className}
      delayDuration={500}
      {...!isOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: appText.nav.viewOptions,
      }}
    >
      {menu}
    </Tooltip>
  );
}
