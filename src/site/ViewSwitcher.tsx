import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import IconFullFrame from '@/site/IconFullFrame';
import IconGrid from '@/site/IconGrid';
import { PATH_ADMIN_PHOTOS, PATH_GRID, PATH_SETS } from '@/site/paths';
import { BiLockAlt } from 'react-icons/bi';
import IconSets from './IconSets';

export type SwitcherSelection = 'full-frame' | 'grid' | 'sets' | 'admin';

export default function ViewSwitcher({
  currentSelection,
  showAdmin,
}: {
  currentSelection?: SwitcherSelection
  showAdmin?: boolean
}) {
  return (
    <Switcher>
      <SwitcherItem
        icon={<IconFullFrame />}
        href="/"
        active={currentSelection === 'full-frame'}
        noPadding
      />
      <SwitcherItem
        icon={<IconGrid />}
        href={PATH_GRID}
        active={currentSelection === 'grid'}
        noPadding
      />
      <SwitcherItem
        className="md:hidden"
        icon={<IconSets />}
        href={PATH_SETS}
        active={currentSelection === 'sets'}
        noPadding
      />
      {showAdmin &&
        <SwitcherItem
          icon={<BiLockAlt size={16} className="translate-y-[-0.5px]" />}
          href={PATH_ADMIN_PHOTOS}
          active={currentSelection === 'admin'}
        />}
    </Switcher>
  );
}
