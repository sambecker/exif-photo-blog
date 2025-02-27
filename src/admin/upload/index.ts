export interface UploadState {
  isUploading: boolean
  uploadError: string
  debugDownload?: { href: string, fileName: string }
  image?: HTMLImageElement
  filesLength: number
  fileUploadIndex: number
  fileUploadName: string
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  isUploading: false,
  uploadError: '',
  fileUploadName: '',
  filesLength: 0,
  fileUploadIndex: 0,
};
