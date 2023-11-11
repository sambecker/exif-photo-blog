import { makeUrlAbsolute, shortenUrl } from '@/utility/url';

export const SITE_TITLE =
  process.env.NEXT_PUBLIC_SITE_TITLE ||
  'Photo Blog';

const VERCEL_BRANCH_URL = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
const VERCEL_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
const VERCEL_URL = VERCEL_BRANCH_URL && VERCEL_BRANCH
  ? `${VERCEL_BRANCH_URL.split(`-git-${VERCEL_BRANCH}-`)[0]}.vercel.app`
  : undefined;

const SITE_DOMAIN =
  process.env.NEXT_PUBLIC_SITE_DOMAIN ||
  VERCEL_URL;

const SITE_DOMAIN_SHORT = shortenUrl(SITE_DOMAIN);

export const SITE_DOMAIN_OR_TITLE =
  SITE_DOMAIN_SHORT ||
  SITE_TITLE;

export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  SITE_DOMAIN;

export const BASE_URL = process.env.NODE_ENV === 'production'
  ? makeUrlAbsolute(SITE_DOMAIN).toLowerCase()
  : 'http://localhost:3000';

export const PRO_MODE_ENABLED = process.env.NEXT_PUBLIC_PRO_MODE === '1';
export const PUBLIC_API_ENABLED = process.env.NEXT_PUBLIC_PUBLIC_API === '1';
export const SHOW_REPO_LINK = process.env.NEXT_PUBLIC_HIDE_REPO_LINK !== '1';
export const SHOW_FILM_SIMULATIONS =
  process.env.NEXT_PUBLIC_HIDE_FILM_SIMULATIONS !== '1';
export const OG_TEXT_BOTTOM_ALIGNMENT =
  (process.env.NEXT_PUBLIC_OG_TEXT_ALIGNMENT ?? '').toUpperCase() === 'BOTTOM';

export const CONFIG_CHECKLIST_STATUS = {
  hasPostgres: (process.env.POSTGRES_HOST ?? '').length > 0,
  hasBlob: (process.env.BLOB_READ_WRITE_TOKEN ?? '').length > 0,
  hasAuth: (process.env.AUTH_SECRET ?? '').length > 0,
  hasAdminUser: (
    (process.env.ADMIN_EMAIL ?? '').length > 0 &&
    (process.env.ADMIN_PASSWORD ?? '').length > 0
  ),
  hasTitle: (process.env.NEXT_PUBLIC_SITE_TITLE ?? '').length > 0,
  hasDomain: (process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '').length > 0,
  showRepoLink: SHOW_REPO_LINK,
  showFilmSimulations: SHOW_FILM_SIMULATIONS,
  isProModeEnabled: PRO_MODE_ENABLED,
  isPublicApiEnabled: PUBLIC_API_ENABLED,
  isOgTextBottomAligned: OG_TEXT_BOTTOM_ALIGNMENT,
};

export type ConfigChecklistStatus = typeof CONFIG_CHECKLIST_STATUS;

export const IS_SITE_READY =
  CONFIG_CHECKLIST_STATUS.hasPostgres &&
  CONFIG_CHECKLIST_STATUS.hasBlob &&
  CONFIG_CHECKLIST_STATUS.hasAuth &&
  CONFIG_CHECKLIST_STATUS.hasAdminUser;
