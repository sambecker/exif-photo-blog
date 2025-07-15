import IconSort from '@/components/icons/IconSort';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { getSortConfigFromPath } from './path';
import IconCheck from '@/components/icons/IconCheck';
import { clsx } from 'clsx/lite';

export default function SortMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}) {
  const pathname = usePathname();
  const sortConfig =  useMemo(() =>
    getSortConfigFromPath(pathname), [pathname]);

  const renderIcon = (isChecked: boolean) => isChecked
    ? <IconCheck size={13} className="translate-x-[-2px]" />
    : <span />;

  const renderLabel = (label: string, isSelected: boolean) => ({
    label,
    labelComplex: <span className={clsx(!isSelected && 'text-dim')}>
      {label}
    </span>,
  });
  
  return (
    <SwitcherItemMenu
      {...{ isOpen, setIsOpen }}
      icon={<IconSort
        sort={sortConfig.isAscending ? 'asc' : 'desc'}
        className="shrink-0 translate-x-[0.5px] translate-y-[1px]"
      />}
      sections={[{
        items: [{
          ...renderLabel('Newest', !sortConfig.isAscending),
          icon: renderIcon(!sortConfig.isAscending),
        }, {
          ...renderLabel('Oldest', sortConfig.isAscending),
          icon: renderIcon(sortConfig.isAscending),
        }],
      }, {
        items: [{
          ...renderLabel('Taken at', sortConfig.isTakenAt),
          icon: renderIcon(sortConfig.isTakenAt),
        }, {
          ...renderLabel('Uploaded', sortConfig.isUploadedAt),
          icon: renderIcon(sortConfig.isUploadedAt),
        }],
      }]}
      align="start"
      side="top"
      sideOffset={12}
      ariaLabel="Sort Menu"
    />
  );
}
