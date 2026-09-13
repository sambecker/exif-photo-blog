import { CategoryKey } from '@/category';
import { Photo } from '@/photo';

// Temporary ceiling for folder previews
export const PHOTO_FOLDER_MAX_PHOTOS = 3;
export const PHOTO_FOLDER_PEEK_PHOTOS = 4;

export interface AboutSetFolder {
  key: string
  caption: string
  path: string
  photos: Photo[]
}

export interface AboutSetFolderRow {
  key: CategoryKey
  title: string
  folders: AboutSetFolder[]
}
