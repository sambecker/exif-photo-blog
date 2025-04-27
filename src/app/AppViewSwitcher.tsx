import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import IconFeed from '@/components/icons/IconFeed';
import IconGrid from '@/components/icons/IconGrid';
import {
  PATH_FEED_INFERRED,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import IconSearch from '../components/icons/IconSearch';
import { useAppState } from '@/state/AppState';
import {
  GRID_HOMEPAGE_ENABLED,
  SHOW_KEYBOARD_SHORTCUT_TOOLTIPS,
} from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import { useCallback, useRef, useState } from 'react';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { usePathname } from 'next/navigation';
import { KEY_COMMANDS } from '@/photo/key-commands';

export type SwitcherSelection = 'feed' | 'grid' | 'admin';

export default function AppViewSwitcher({
  currentSelection,
  className,
}: {
  currentSelection?: SwitcherSelection
  className?: string
}) {
  const pathname = usePathname();

  const {
    isUserSignedIn,
    isUserSignedInEager,
    setIsCommandKOpen,
  } = useAppState();

  const refHrefFeed = useRef<HTMLAnchorElement>(null);
  const refHrefGrid = useRef<HTMLAnchorElement>(null);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!e.metaKey) {
      switch (e.key.toLocaleUpperCase()) {
      case KEY_COMMANDS.feed:
        if (pathname !== PATH_FEED_INFERRED) { refHrefFeed.current?.click(); }
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

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const renderItemFeed =
    <SwitcherItem
      icon={<IconFeed includeTitle={false} />}
      href={PATH_FEED_INFERRED}
      hrefRef={refHrefFeed}
      active={currentSelection === 'feed'}
      tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: 'Feed',
        keyCommand: KEY_COMMANDS.feed,
      }}}
      noPadding
    />;

  const renderItemGrid =
    <SwitcherItem
      icon={<IconGrid includeTitle={false} />}
      href={PATH_GRID_INFERRED}
      hrefRef={refHrefGrid}
      active={currentSelection === 'grid'}
      tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
        content: 'Grid',
        keyCommand: KEY_COMMANDS.grid,
      }}}
      noPadding
    />;

  return (
    <div
      className={clsx(
        'flex gap-1 sm:gap-2',
        className,
      )}
    >
      <Switcher>
        {GRID_HOMEPAGE_ENABLED ? renderItemGrid : renderItemFeed}
        {GRID_HOMEPAGE_ENABLED ? renderItemFeed : renderItemGrid}
        {/* Show spinner if admin is suspected to be logged in */}
        {(isUserSignedInEager && !isUserSignedIn) &&
          <SwitcherItem
            icon={<Spinner />}
            isInteractive={false}
            noPadding
            tooltip={{
              ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                content: 'Admin Menu',
                keyCommand: KEY_COMMANDS.admin,
              },
            }}
          />}
        {isUserSignedIn &&
          <SwitcherItem
            icon={<AdminAppMenu
              isOpen={isAdminMenuOpen}
              setIsOpen={setIsAdminMenuOpen}
            />}
            tooltip={{
              ...!isAdminMenuOpen && SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
                content: 'Admin Menu',
                keyCommand: KEY_COMMANDS.admin,
              },
            }}
            noPadding
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch includeTitle={false} />}
          onClick={() => setIsCommandKOpen?.(true)}
          tooltip={{...SHOW_KEYBOARD_SHORTCUT_TOOLTIPS && {
            content: 'Search',
            keyCommandModifier: KEY_COMMANDS.search[0],
            keyCommand: KEY_COMMANDS.search[1],
          }}}
        />
      </Switcher>
    </div>
  );
}
