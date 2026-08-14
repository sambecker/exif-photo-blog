import { createContext, use } from 'react';

export type PhotoTitleEdit = {
  title: string
  caption: string
};

export type EditTitlesState = {
  isEditingTitles?: boolean
  startEditingTitles?: () => void
  stopEditingTitles?: () => void
  photoEdits?: Record<string, PhotoTitleEdit>
  getPhotoEdit?: (
    photoId: string,
    original: PhotoTitleEdit,
  ) => PhotoTitleEdit
  setPhotoEdit?: (
    photoId: string,
    edit: Partial<PhotoTitleEdit>,
    original: PhotoTitleEdit,
  ) => void
  modifiedPhotoCount?: number
  isPerformingUpdate?: boolean
  setIsPerformingUpdate?: (isPerforming: boolean) => void
  clearPhotoEdits?: () => void
};

export const EditTitlesContext = createContext<EditTitlesState>({});

export const useEditTitlesState = () => use(EditTitlesContext);
