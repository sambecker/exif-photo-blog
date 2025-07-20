import IconHidden from '@/components/icons/IconHidden';
import { PhotoFormData } from '../form';
import IconLock from '@/components/icons/IconLock';
import { SelectMenuOptionType } from '@/components/SelectMenuOption';
import { Photo } from '..';

export type VisibilityValue = 'default' | 'exclude' | 'private';

export const EXCLUDE_DESCRIPTION =
  'Excluded from homepage views, rss.xml, etc.';
export const PRIVATE_DESCRIPTION =
  'Visible only to admins';

export const VISIBILITY_OPTIONS: SelectMenuOptionType<VisibilityValue>[] = [
  {
    value: 'default',
    accessoryStart: <IconHidden size={17} visible />,
    label: 'Default',
    note: 'Viewable everywhere',
  },
  {
    value: 'exclude',
    accessoryStart: <IconHidden size={17} />,
    label: 'Hide from feeds',
    note: EXCLUDE_DESCRIPTION,
  },
  {
    value: 'private',
    accessoryStart: <IconLock size={14} />,
    label: 'Private',
    note: PRIVATE_DESCRIPTION,
  },
];

export const getVisibilityValue = (
  formData: Partial<PhotoFormData>,
): VisibilityValue =>
  formData.hidden === 'true'
    ? 'private'
    : formData.excludeFromFeeds === 'true'
      ? 'exclude'
      : 'default';

export const updateFormDataWithVisibility = (
  formData: Partial<PhotoFormData>,
  value: VisibilityValue,
): Partial<PhotoFormData> => {
  return {
    ...formData,
    ...value === 'private'
      ? { hidden: 'true', excludeFromFeeds: 'false' }
      : value === 'exclude'
        ? { hidden: 'false', excludeFromFeeds: 'true' }
        : { hidden: 'false', excludeFromFeeds: 'false' },
  };
};

export const didVisibilityChange = (
  original: Partial<PhotoFormData>,
  current: Partial<PhotoFormData>,
) => getVisibilityValue(original) !== getVisibilityValue(current);

export const doesPhotoHaveDefaultVisibility = (photo: Photo) =>
  !photo.hidden && !photo.excludeFromFeeds;
