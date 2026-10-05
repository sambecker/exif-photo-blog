'use client';

import { createContext, use, RefObject } from 'react';
import {
  INITIAL_UPLOAD_STATE,
  UploadBlobArgs,
  UploadState,
} from '.';

export type UploadStateContextType = {
  uploadInputRef?: RefObject<HTMLInputElement | null>
  uploadState: UploadState
  setUploadState?: (uploadState: Partial<UploadState>) => void
  resetUploadState?: () => void
  // Set while a page shows its own upload button and status,
  // independent of upload state so resets don't clear it
  hideUploadPanel?: boolean
  setHideUploadPanel?: (hideUploadPanel: boolean) => void
  // Returns false when upload is cancelled
  startUpload?: () => Promise<boolean>
  startUploadSession?: () => AbortSignal
  cancelUpload?: () => void
  onUploadStart?: () => void
  onUploadBlobReady?: (args: UploadBlobArgs) => Promise<void>
  isFinishingUpload?: boolean
};

export const UploadStateContext = createContext<UploadStateContextType>({
  uploadState: INITIAL_UPLOAD_STATE,
});

export const useUploadState = () => use(UploadStateContext);
