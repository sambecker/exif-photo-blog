import { ComponentProps } from 'react';
import MoreMenuItem, {
  renderMenuItemCheck,
  renderMenuItemLabel,
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
    ...renderMenuItemLabel(descendingLabel, !isAscending),
    icon: renderMenuItemCheck(!isAscending),
    href: pathDescending,
  }, {
    ...renderMenuItemLabel(ascendingLabel, isAscending),
    icon: renderMenuItemCheck(isAscending),
    href: pathAscending,
  }];

  const itemsSortType: SortMenuItem[] = [{
    ...renderMenuItemLabel(appText.sort.takenAt, isTakenAt),
    icon: renderMenuItemCheck(isTakenAt),
    href: pathTakenAt,
  }, {
    ...renderMenuItemLabel(appText.sort.uploadedAtShort, isUploadedAt),
    icon: renderMenuItemCheck(isUploadedAt),
    href: pathUploadedAt,
  }];

  if (COLOR_SORT_ENABLED) {
    itemsSortType.push({
      ...renderMenuItemLabel(appText.sort.color, isColor),
      icon: renderMenuItemCheck(isColor),
      href: pathColor,
    });
  }

  return { itemsSortOrder, itemsSortType };
};
