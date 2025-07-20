export const SWR_KEYS = {
  GET_AUTH: 'GET_AUTH',
  GET_ADMIN_DATA: 'GET_ADMIN_DATA',
  GET_COUNTS_FOR_CATEGORIES: 'GET_COUNTS_FOR_CATEGORIES',
  SHARED_HOVER: 'SHARED_HOVER',
  INFINITE_PHOTO_SCROLL: 'INFINITE_PHOTO_SCROLL',
} as const;

const KEYS_THAT_CAN_BE_PURGED = [
  SWR_KEYS.SHARED_HOVER,
  SWR_KEYS.INFINITE_PHOTO_SCROLL,
] as const;

const KEYS_THAT_CAN_BE_PURGED_AND_REVALIDATED = [
  SWR_KEYS.GET_ADMIN_DATA,
  SWR_KEYS.GET_COUNTS_FOR_CATEGORIES,
] as const;

export type SWRKey = typeof SWR_KEYS[keyof typeof SWR_KEYS];

export const canKeyBePurged = (key: string) =>
  KEYS_THAT_CAN_BE_PURGED.some(k => key.startsWith(k));

export const canKeyBePurgedAndRevalidated = (key: string) =>
  KEYS_THAT_CAN_BE_PURGED_AND_REVALIDATED.some(k => key.startsWith(k));
