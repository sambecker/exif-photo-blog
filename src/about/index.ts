import { META_TITLE, SHOW_TEMPLATE_ATTRIBUTION } from '@/app/config';
import { AppTextState } from '@/i18n/state';

export interface AboutInsert {
  id: number
  title?: string
  subhead?: string
  description?: string
  photoIdAvatar?: string
  photoIdHero?: string
}

export interface About extends AboutInsert {
  createdAt: Date
  updatedAt: Date
}

// Leave title/subhead blank to reveal default values
export const getAboutMeta = (
  appText: AppTextState,
  title?: string,
  subhead?: string,
) => ({
  title: title || META_TITLE || appText.about.titleDefault,
  subhead: subhead || (SHOW_TEMPLATE_ATTRIBUTION
    ? appText.utility.madeWithExifPhotoBlog
    : undefined),
});
