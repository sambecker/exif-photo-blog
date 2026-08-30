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
  SWITCHER_ITEM_INTERACTIVE_BG,
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
import IconSortNav from '@/components/icons/IconSortNav';

const VIEW_ICON_CLASS = 'w-[24px] -ml-[4px] translate-x-[1px]';

export default function AppViewMenuCompact({
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

  const renderIconGrid = (forMenu?: boolean) => isMasonry
    ? <IconGridMasonry className={forMenu ? VIEW_ICON_CLASS : ''} />
    : <IconGrid className={forMenu ? VIEW_ICON_CLASS : ''} />;

  // Selected views are marked with a check, unselected show their own icon
  const renderViewIcon = (icon: ReactNode, isSelected: boolean) => isSelected
    ? renderMenuItemCheck(true)
    : icon;

  const itemGrid = {
    label: appText.nav.grid,
    icon: renderViewIcon(renderIconGrid(true), !isViewFull),
    ...hrefGrid
      ? { href: hrefGrid }
      : { action: () => onSelectView?.(false) },
    ...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && { keyCommand: KEY_COMMANDS.grid },
  };

  const itemFull = {
    label: appText.nav.full,
    icon: renderViewIcon(
      <IconFull className={VIEW_ICON_CLASS} />,
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
      icon: <IconSortNav
        sort={sortConfig.isAscending ? 'asc' : 'desc'}
        className={clsx(VIEW_ICON_CLASS, 'w-[30px]! -ml-2!')} 
      />,
      // Sort types are only offered where the nav exposes a full sort menu
      sections: NAV_SORT_CONTROL === 'menu'
        ? [{ items: itemsSortOrder }, { items: itemsSortType }]
        : [{ items: itemsSortOrder }],
    });
  }

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
              className="shrink-0 -ml-1.5 text-dim"
            />
          </>}
          classNameButton={clsx(
            'inline-flex items-center',
            'h-[28px]',
            'rounded-full',
            'text-main!',
            SWITCHER_ITEM_INTERACTIVE_BG,
            'cursor-pointer',
          )}
          classNameButtonOpen="bg-dim!"
        />
      </div>
    </Tooltip>
  );
}
