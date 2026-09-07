export interface UploadState {
  isUploading: boolean
  uploadError: string
  debugDownload?: { href: string, fileName: string }
  hideUploadPanel?: boolean
  fileUploadName: string
  fileUploadIndex: number
  filesLength: number
  uploadProgress?: number
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  isUploading: false,
  uploadError: '',
  hideUploadPanel: false,
  fileUploadName: '',
  fileUploadIndex: 0,
  filesLength: 0,
};

export const getUploadProgress = (
  fileSizes: number[],
  fileIndex: number,
  bytesLoaded: number,
) => {
  const bytesTotal = fileSizes.reduce((sum, size) => sum + size, 0);
  if (bytesTotal <= 0) { return 0; }
  const bytesCompleted = fileSizes
    .slice(0, fileIndex)
    .reduce((sum, size) => sum + size, 0);
  return Math.min(1, (bytesCompleted + bytesLoaded) / bytesTotal);
};
