import { unstable_noStore } from 'next/cache';
import { getStoragePhotoUrls, getStorageUploadUrls } from '@/services/storage';

export const getStorageUploadUrlsNoStore: typeof getStorageUploadUrls =
  (...args) => {
    unstable_noStore();
    return getStorageUploadUrls(...args);
  };

export const getStoragePhotoUrlsNoStore: typeof getStoragePhotoUrls =
  (...args) => {
    unstable_noStore();
    return getStoragePhotoUrls(...args);
  };