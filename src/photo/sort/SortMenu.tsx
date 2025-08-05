import IconSort from '@/components/icons/IconSort';
import SwitcherItemMenu from '@/components/switcher/SwitcherItemMenu';
import { getSortStateFromPath } from './path';
import IconCheck from '@/components/icons/IconCheck';
import { clsx } from 'clsx/lite';
import { useAppText } from '@/i18n/state/client';
import { COLOR_SORT_ENABLED } from '@/app/config';

export default function SortMenu({
  isOpen,
  setIsOpen,
  isAscending,
  isTakenAt,
  isUploadedAt,
  isColor,
  descendingLabel,
  ascendingLabel,
  pathDescending,
  pathAscending,
  pathTakenAt,
  pathUploadedAt,
  pathColor,
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
  
  const itemsSortOrder = [{
    ...renderLabel(
      descendingLabel,
      !isAscending,
    ),
    icon: renderIcon(!isAscending),
    href: pathDescending,
  }, {
    ...renderLabel(
      ascendingLabel,
      isAscending,
    ),
    icon: renderIcon(isAscending),
    href: pathAscending,
  }];

  const itemsSortType = [{
    ...renderLabel(appText.sort.takenAt, isTakenAt),
    icon: renderIcon(isTakenAt),
    href: pathTakenAt,
  }, {
    ...renderLabel(appText.sort.uploadedAtShort, isUploadedAt),
    icon: renderIcon(isUploadedAt),
    href: pathUploadedAt,
  }];

  if (COLOR_SORT_ENABLED) {
    itemsSortType.push({
      ...renderLabel(appText.sort.color, isColor),
      icon: renderIcon(isColor),
      href: pathColor,
    });
  }

  return (
    <SwitcherItemMenu
      {...{ isOpen, setIsOpen }}
      icon={<IconSort
        sort={isAscending ? 'asc' : 'desc'}
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
