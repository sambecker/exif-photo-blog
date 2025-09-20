export interface UploadState {
  isUploading: boolean
  uploadError: string
  debugDownload?: { href: string, fileName: string }
  hideUploadPanel?: boolean
  fileUploadName: string
  fileUploadIndex: number
  filesLength: number
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  isUploading: false,
  uploadError: '',
  hideUploadPanel: false,
  fileUploadName: '',
  fileUploadIndex: 0,
  filesLength: 0,
};
