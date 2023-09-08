export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE
  || 'Photo Blog';

const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN
  || process.env.NEXT_PUBLIC_VERCEL_URL;

export const SITE_DOMAIN_OR_TITLE = SITE_DOMAIN || SITE_TITLE;

export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION
  || SITE_DOMAIN;

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://${SITE_DOMAIN}`
  : 'http://localhost:3000';

export const CONFIG_CHECKLIST_STATUS = {
  hasTitle: (process.env.NEXT_PUBLIC_SITE_TITLE ?? '').length > 0,
  hasDomain: (process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '').length > 0,
  hasPostgres: (process.env.POSTGRES_HOST ?? '').length > 0,
  hasBlob: (process.env.BLOB_READ_WRITE_TOKEN ?? '').length > 0,
  hasAuth: (process.env.AUTH_SECRET ?? '').length > 0,
  hasAdminUser: (
    (process.env.ADMIN_EMAIL ?? '').length > 0 &&
    (process.env.ADMIN_PASSWORD ?? '').length > 0
  ),
};
