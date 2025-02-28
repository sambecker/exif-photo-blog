export interface UploadState {
  isUploading: boolean
  uploadError: string
  debugDownload?: { href: string, fileName: string }
  image?: HTMLImageElement
  fileUploadName: string
  fileUploadIndex: number
  filesLength: number
}

export const INITIAL_UPLOAD_STATE: UploadState = {
  isUploading: false,
  uploadError: '',
  fileUploadName: '',
  fileUploadIndex: 0,
  filesLength: 0,
};
