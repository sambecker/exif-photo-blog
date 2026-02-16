import { PhotoQueryOptions } from '@/db';
import { createContext, Dispatch, SetStateAction, use } from 'react';

export type SelectPhotosState = {
  canCurrentPageSelectPhotos?: boolean
  isSelectingPhotos?: boolean
  isSelectingAllPhotos?: boolean
  shouldShowSelectAll?: boolean
  toggleIsSelectingAllPhotos?: () => void
  startSelectingPhotos?: () => void
  stopSelectingPhotos?: () => void
  selectedPhotoIds?: string[]
  selectAllPhotoOptions?: PhotoQueryOptions
  selectAllCount?: number
  togglePhotoSelection?: (photoId: string) => void
  isPerformingSelectEdit?: boolean
  setIsPerformingSelectEdit?: Dispatch<SetStateAction<boolean>>
};

export const SelectPhotosContext = createContext<SelectPhotosState>({});

export const useSelectPhotosState = () => use(SelectPhotosContext);
