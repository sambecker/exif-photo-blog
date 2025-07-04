export const SWR_KEY_GET_AUTH = 'getAuth';
export const SWR_KEY_GET_ADMIN_DATA = 'getAdminData';
export const SWR_KEY_GET_COUNTS_FOR_CATEGORIES = 'getCountsForCategories';
export const SWR_KEY_SHARED_HOVER = 'sharedHover';
export const SWR_KEY_INFINITE_PHOTO_SCROLL = 'infinitePhotoScroll';

const KEYS_THAT_CAN_BE_PURGED = [
  SWR_KEY_SHARED_HOVER,
  SWR_KEY_INFINITE_PHOTO_SCROLL,
];

const KEYS_THAT_CAN_BE_PURGED_AND_REVALIDATED = [
  SWR_KEY_GET_ADMIN_DATA,
  SWR_KEY_GET_COUNTS_FOR_CATEGORIES,
];

export const canKeyBePurged = (key: string) =>
  KEYS_THAT_CAN_BE_PURGED.some(k => key.startsWith(k));

export const canKeyBePurgedAndRevalidated = (key: string) =>
  KEYS_THAT_CAN_BE_PURGED_AND_REVALIDATED.some(k => key.startsWith(k));
