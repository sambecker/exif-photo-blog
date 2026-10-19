import { ComponentProps } from 'react';
import MoreMenuItem, {
  renderMenuItemCheck,
} from '@/components/more/MoreMenuItem';
import { COLOR_SORT_ENABLED } from '@/app/config';
import { AppTextState } from '@/i18n/state';
import { getSortStateFromPath } from './path';

type SortMenuItem = ComponentProps<typeof MoreMenuItem>;

export const getSortMenuItems = ({
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
}: ReturnType<typeof getSortStateFromPath>, appText: AppTextState): {
  itemsSortOrder: SortMenuItem[]
  itemsSortType: SortMenuItem[]
} => {
  const itemsSortOrder: SortMenuItem[] = [{
    label: descendingLabel,
    icon: renderMenuItemCheck(!isAscending),
    href: pathDescending,
  }, {
    label: ascendingLabel,
    icon: renderMenuItemCheck(isAscending),
    href: pathAscending,
  }];

  const itemsSortType: SortMenuItem[] = [{
    label: appText.sort.takenAt,
    icon: renderMenuItemCheck(isTakenAt),
    href: pathTakenAt,
  }, {
    label: appText.sort.uploadedAtShort,
    icon: renderMenuItemCheck(isUploadedAt),
    href: pathUploadedAt,
  }];

  if (COLOR_SORT_ENABLED) {
    itemsSortType.push({
      label: appText.sort.color,
      icon: renderMenuItemCheck(isColor),
      href: pathColor,
    });
  }

  return { itemsSortOrder, itemsSortType };
};
