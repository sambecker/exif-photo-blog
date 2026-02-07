import { Photo, PhotoDbInsert } from '..';
import { doesPhotoUrlHaveOptimizedFiles } from '../storage';

// Used to anonymize storage/create optimized files if necessary
// by re-running convertUploadToPhoto (image upload transfer logic)
export const shouldBackfillPhotoStorage = async (
  photo: Photo | PhotoDbInsert,
) =>
  photo.url.includes(photo.id) ||
  !await doesPhotoUrlHaveOptimizedFiles(photo.url);
