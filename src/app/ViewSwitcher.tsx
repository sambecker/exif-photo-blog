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

export type SwitcherSelection = 'feed' | 'grid' | 'admin';

export default function ViewSwitcher({
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

  const renderItemFeed =
    <SwitcherItem
      icon={<IconFeed includeTitle={false} />}
      href={PATH_FEED_INFERRED}
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
      active={currentSelection === 'grid'}
      tooltip={{
        content: 'Grid',
        keyCommand: 'G',
      }}
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
            tooltip={{ content: 'Admin Menu' }}
          />}
        {isUserSignedIn &&
          <SwitcherItem
            icon={<AdminAppMenu />}
            noPadding
            tooltip={{ content: 'Admin Menu' }}
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          title="Search"
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
