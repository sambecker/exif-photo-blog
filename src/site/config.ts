export const SITE_TITLE = process.env.NEXT_PUBLIC_SITE_TITLE
  || 'Photo Blog';

export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN
  || process.env.NEXT_PUBLIC_VERCEL_URL
  || SITE_TITLE;

export const SITE_DESCRIPTION = process.env.NEXT_PUBLIC_SITE_DESCRIPTION
  || SITE_DOMAIN;

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://${SITE_DOMAIN}`
  : 'http://localhost:3000';
