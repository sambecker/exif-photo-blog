import { createContext, Dispatch, SetStateAction, use } from 'react';

export type SelectPhotosState = {
  canCurrentPageSelectPhotos?: boolean
  setCanCurrentPageSelectPhotos?: Dispatch<SetStateAction<boolean>>
  isSelectingPhotos?: boolean
  setIsSelectingPhotos?: Dispatch<SetStateAction<boolean>>
  startSelectingPhotosPath?: string
  setStartSelectingPhotosPath?: Dispatch<SetStateAction<string>>
  stopSelectingPhotosPath?: string
  setStopSelectingPhotosPath?: Dispatch<SetStateAction<string>>
  selectedPhotoIds?: string[]
  setSelectedPhotoIds?: (photoIds: string[]) => void
  isPerformingSelectEdit?: boolean
  setIsPerformingSelectEdit?: Dispatch<SetStateAction<boolean>>
};

export const SelectPhotosContext = createContext<SelectPhotosState>({});

export const useSelectPhotosState = () => use(SelectPhotosContext);
