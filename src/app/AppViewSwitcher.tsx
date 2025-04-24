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
import { useState } from 'react';

export type SwitcherSelection = 'feed' | 'grid' | 'admin';

export default function AppViewSwitcher({
  currentSelection,
  className,
}: {
  currentSelection?: SwitcherSelection
  className?: string
}) {
  const {
    isUserSignedIn,
    isUserSignedInEager,
    setIsCommandKOpen,
  } = useAppState();

  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const renderItemFeed =
    <SwitcherItem
      icon={<IconFeed includeTitle={false} className="translate-x-[-0.5px]" />}
      href={PATH_FEED_INFERRED}
      active={currentSelection === 'feed'}
      tooltip={!isAdminMenuOpen
        ? {
          content: 'Feed',
          keyCommand: 'F',
        }
        : undefined}
      noPadding
    />;

  const renderItemGrid =
    <SwitcherItem
      icon={<IconGrid includeTitle={false} className="translate-x-[-0.5px]" />}
      href={PATH_GRID_INFERRED}
      active={currentSelection === 'grid'}
      tooltip={!isAdminMenuOpen
        ? {
          content: 'Grid',
          keyCommand: 'G',
        }
        : undefined}
      noPadding
    />;

  return (
    <div className={clsx(
      'flex gap-1 sm:gap-2',
      className,
    )}>
      <Switcher>
        {GRID_HOMEPAGE_ENABLED ? renderItemGrid : renderItemFeed}
        {GRID_HOMEPAGE_ENABLED ? renderItemFeed : renderItemGrid}
        {/* Show spinner if admin is suspected to be logged in */}
        {(isUserSignedInEager && !isUserSignedIn) &&
          <SwitcherItem
            icon={<Spinner />}
            isInteractive={false}
            noPadding
            tooltip={!isAdminMenuOpen
              ? { content: 'Admin Menu' }
              : undefined}
          />}
        {isUserSignedIn &&
          <SwitcherItem
            icon={<AdminAppMenu
              isOpen={isAdminMenuOpen}
              setIsOpen={setIsAdminMenuOpen}
            />}
            tooltip={!isAdminMenuOpen
              ? { content: 'Admin Menu' }
              : undefined}
            noPadding
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch includeTitle={false} />}
          onClick={() => setIsCommandKOpen?.(true)}
          tooltip={!isAdminMenuOpen
            ? {
              content: 'Search',
              keyCommand: 'K',
              keyCommandModifier: '⌘',
            }
            : undefined}
        />
      </Switcher>
    </div>
  );
}
