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
import { GRID_HOMEPAGE_ENABLED } from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import Spinner from '@/components/Spinner';
import clsx from 'clsx/lite';
import { useCallback, useRef, useState } from 'react';
import useKeydownHandler from '@/utility/useKeydownHandler';
import { usePathname } from 'next/navigation';

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
    switch (e.key.toLocaleUpperCase()) {
    case 'F':
      if (pathname !== PATH_FEED_INFERRED) { refHrefFeed.current?.click(); }
      break;
    case 'G':
      if (pathname !== PATH_GRID_INFERRED) { refHrefGrid.current?.click(); }
      break;
    case 'A':
      if (isUserSignedIn) { setIsAdminMenuOpen(true); }
      break;
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
      tooltip={{
        content: 'Feed',
        keyCommand: 'F',
      }}
      noPadding
    />;

  const renderItemGrid =
    <SwitcherItem
      icon={<IconGrid includeTitle={false} />}
      href={PATH_GRID_INFERRED}
      hrefRef={refHrefGrid}
      active={currentSelection === 'grid'}
      tooltip={{
        content: 'Grid',
        keyCommand: 'G',
      }}
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
            tooltip={{ content: 'Admin Menu' }}
          />}
        {isUserSignedIn &&
          <SwitcherItem
            icon={<AdminAppMenu
              isOpen={isAdminMenuOpen}
              setIsOpen={setIsAdminMenuOpen}
            />}
            tooltip={{
              content: !isAdminMenuOpen ? 'Admin Menu' : undefined,
              keyCommand: !isAdminMenuOpen ? 'A' : undefined,
            }}
            noPadding
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch includeTitle={false} />}
          onClick={() => setIsCommandKOpen?.(true)}
          tooltip={{
            content: 'Search',
            keyCommand: 'K',
            keyCommandModifier: '⌘',
          }}
        />
      </Switcher>
    </div>
  );
}
