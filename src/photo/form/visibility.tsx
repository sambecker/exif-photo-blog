import IconHidden from '@/components/icons/IconHidden';
import { PhotoFormData } from '.';
import IconLock from '@/components/icons/IconLock';
import { SelectMenuOptionType } from '@/components/SelectMenuOption';

export type VisibilityValue = 'basic' | 'exclude' | 'private';

export const VISIBILITY_OPTIONS: SelectMenuOptionType[] = [
  {
    value: 'basic',
    accessoryStart: <IconHidden size={17} visible />,
    label: 'Basic',
    note: 'Viewable everywhere',
  },
  {
    value: 'exclude',
    accessoryStart: <IconHidden size={17} />,
    label: 'Hide from feeds',
    note: 'Exclude from home page views, rss.xml, etc.',
  },
  {
    value: 'private',
    accessoryStart: <IconLock size={14} />,
    label: 'Private',
    note: 'Visible only to admins',
  },
];

export const getVisibilityValue = (
  formData: Partial<PhotoFormData>,
): VisibilityValue =>
  formData.hidden === 'true'
    ? 'private'
    : formData.excludeFromFeeds === 'true'
      ? 'exclude'
      : 'basic';

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
