import IconSort from '@/components/icons/IconSort';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';
import { getSortStateFromPath } from './path';
import { getSortMenuItems } from './menu';
import { useAppText } from '@/i18n/state/client';

export default function SortMenu({
  isOpen,
  setIsOpen,
  ...sortConfig
}: {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
} & ReturnType<typeof getSortStateFromPath>) {
  const appText = useAppText();

  const { itemsSortOrder, itemsSortType } =
    getSortMenuItems(sortConfig, appText);

  return (
    <SwitcherItemMenu
      {...{ isOpen, setIsOpen }}
      icon={<IconSort
        sort={sortConfig.isAscending ? 'asc' : 'desc'}
        className="shrink-0 translate-x-[0.5px] translate-y-[1px]"
      />}
      sections={[{
        items: itemsSortOrder,
      }, {
        items: itemsSortType,
      }]}
      align="start"
      side="top"
      sideOffset={12}
      ariaLabel="Sort Menu"
    />
  );
}
