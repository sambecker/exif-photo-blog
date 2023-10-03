import Switcher from '@/components/Switcher';
import SwitcherItem from '@/components/SwitcherItem';
import IconFullFrame from '@/icons/IconFullFrame';
import IconGrid from '@/icons/IconGrid';
import { PATH_GRID } from '@/site/paths';
import { BiLockAlt } from 'react-icons/bi';

export type SwitcherSelection = 'full-frame' | 'grid' | 'admin';

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
      {showAdmin &&
        <SwitcherItem
          icon={<BiLockAlt size={15} className="-translate-y-[1px]" />}
          href="/admin/photos"
          active={currentSelection === 'admin'}
        />}
    </Switcher>
  );
}
