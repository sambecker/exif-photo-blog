import { Photo, PhotoSetAttributes, PhotoSetCategory } from '@/photo';

export type ShareModalProps = Omit<PhotoSetAttributes, 'photos'> & {
  photo?: Photo
  photos?: Photo[]
} & PhotoSetCategory;
