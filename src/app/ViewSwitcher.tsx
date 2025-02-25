import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import IconFeed from '@/app/IconFeed';
import IconGrid from '@/app/IconGrid';
import {
  PATH_FEED_INFERRED,
  PATH_GRID_INFERRED,
} from '@/app/paths';
import IconSearch from './IconSearch';
import { useAppState } from '@/state/AppState';
import { GRID_HOMEPAGE_ENABLED } from './config';
import AdminAppMenu from '@/admin/AdminAppMenu';
import { clsx } from 'clsx/lite';

export type SwitcherSelection = 'feed' | 'grid' | 'admin';

export default function ViewSwitcher({
  currentSelection,
}: {
  currentSelection?: SwitcherSelection
}) {
  const { setIsCommandKOpen, isUserSignedIn } = useAppState();

  const renderItemFeed = () =>
    <SwitcherItem
      icon={<IconFeed />}
      href={PATH_FEED_INFERRED}
      active={currentSelection === 'feed'}
      noPadding
    />;

  const renderItemGrid = () =>
    <SwitcherItem
      icon={<IconGrid />}
      href={PATH_GRID_INFERRED}
      active={currentSelection === 'grid'}
      noPadding
    />;

  return (
    <div className="flex gap-1 sm:gap-2">
      <Switcher>
        {GRID_HOMEPAGE_ENABLED ? renderItemGrid() : renderItemFeed()}
        {GRID_HOMEPAGE_ENABLED ? renderItemFeed() : renderItemGrid()}
        {isUserSignedIn &&
          <AdminAppMenu
            className="mt-3 ml-[-84px]"
            buttonClassName={clsx(
              'w-[40px] h-[28px]',
              'flex items-center justify-center',
              'active:bg-transparent',
              currentSelection === 'admin'
                ? 'text-black dark:text-white'
                : 'text-gray-400 dark:text-gray-600',
            )}
          />}
      </Switcher>
      <Switcher type="borderless">
        <SwitcherItem
          icon={<IconSearch />}
          onClick={() => setIsCommandKOpen?.(true)}
        />
      </Switcher>
    </div>
  );
}
