// Height determined by intrinsic photo aspect ratio
export const IMAGE_TINY_WIDTH = 50;

// Height determined by intrinsic photo aspect ratio
export const IMAGE_SMALL_WIDTH = 300;

// Height determined by intrinsic photo aspect ratio
export const IMAGE_LARGE_WIDTH = 900;

// 16:9 og image ratio
export const IMAGE_OG_RATIO = 16 / 9;
export const IMAGE_OG_WIDTH = 1200;
export const IMAGE_OG_HEIGHT = IMAGE_OG_WIDTH * (1 / IMAGE_OG_RATIO);

// 3:2 og grid ratio
export const GRID_OG_RATIO = 1.35;
export const GRID_OG_WIDTH = 1200;
export const GRID_OG_HEIGHT = GRID_OG_WIDTH * (1 / GRID_OG_RATIO);

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z0-9]+)_[a-z0-9]+$/i,
)?.[1].toLowerCase();

export const BLOB_BASE_URL =
  `https://${STORE_ID}.public.blob.vercel-storage.com`;

export const SITE_CHECKLIST_STATUS = {
  hasTitle: (process.env.NEXT_PUBLIC_SITE_TITLE ?? '').length > 0,
  hasDomain: (process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '').length > 0,
  hasPostgres: (process.env.POSTGRES_HOST ?? '').length > 0,
  hasBlob: (process.env.BLOB_READ_WRITE_TOKEN ?? '').length > 0,
  hasAuth: (
    (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '').length > 0 &&
    (process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '').length > 0 &&
    (process.env.CLERK_SECRET_KEY ?? '').length > 0 &&
    (process.env.CLERK_ADMIN_USER_ID ?? '').length > 0
  ),
};
