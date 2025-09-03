import { uploadFileFromClient } from '@/platforms/storage';
import { EXTENSION_DEFAULT, PREFIX_UPLOAD } from '.';

export const uploadPhotoFromClient = (
  file: File | Blob,
  extension = EXTENSION_DEFAULT,
) =>
  uploadFileFromClient(file, PREFIX_UPLOAD, extension);
