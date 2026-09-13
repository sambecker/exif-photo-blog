import { META_TITLE, SHOW_TEMPLATE_ATTRIBUTION } from '@/app/config';
import type { CategoryKey } from '@/category';
import { AppTextState } from '@/i18n/state';
import type { Photo } from '@/photo';

export interface LibraryInsert {
  id: number
  title?: string
  subhead?: string
  description?: string
  photoIdAvatar?: string
  photoIdHero?: string
}

export interface Library extends LibraryInsert {
  createdAt: Date
  updatedAt: Date
}

export interface LibrarySetFolder {
  key: string
  caption: string
  path: string
  photos: Photo[]
  count: number
}

export interface LibrarySetFolderRow {
  key: CategoryKey
  title: string
  folders: LibrarySetFolder[]
}

// Leave title/subhead blank to reveal default values
export const getLibraryMeta = (
  appText: AppTextState,
  title?: string,
  subhead?: string,
) => ({
  title: title || META_TITLE || appText.library.titleDefault,
  subhead: subhead || (SHOW_TEMPLATE_ATTRIBUTION
    ? appText.utility.madeWithExifPhotoBlog
    : undefined),
});
