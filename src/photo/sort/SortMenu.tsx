import IconSort from '@/components/icons/IconSort';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';
import { getSortStateFromPath } from './path';
import IconCheck from '@/components/icons/IconCheck';
import { clsx } from 'clsx/lite';
import { useAppText } from '@/i18n/state/client';

export default function SortMenu({
  isOpen,
  setIsOpen,
  isAscending,
  isTakenAt,
  isUploadedAt,
  pathNewest,
  pathOldest,
  pathTakenAt,
  pathUploadedAt,
}: {
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
} & ReturnType<typeof getSortStateFromPath>) {
  const appText = useAppText();

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
        sort={isAscending ? 'asc' : 'desc'}
        className="shrink-0 translate-x-[0.5px] translate-y-[1px]"
      />}
      sections={[{
        items: [{
          ...renderLabel(appText.sort.newest, !isAscending),
          icon: renderIcon(!isAscending),
          href: pathNewest,
        }, {
          ...renderLabel(appText.sort.oldest, isAscending),
          icon: renderIcon(isAscending),
          href: pathOldest,
        }],
      }, {
        items: [{
          ...renderLabel(appText.sort.takenAt, isTakenAt),
          icon: renderIcon(isTakenAt),
          href: pathTakenAt,
        }, {
          ...renderLabel(appText.sort.uploadedAtShort, isUploadedAt),
          icon: renderIcon(isUploadedAt),
          href: pathUploadedAt,
        }],
      }]}
      align="start"
      side="top"
      sideOffset={12}
      ariaLabel="Sort Menu"
    />
  );
}
