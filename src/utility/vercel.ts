import {
  IS_PREVIEW,
  VERCEL_BYPASS_KEY,
  VERCEL_BYPASS_SECRET,
} from '@/site/config';

export const fetchWithBypass: typeof fetch = (url, options) =>
  IS_PREVIEW && VERCEL_BYPASS_SECRET
    ? fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        [VERCEL_BYPASS_KEY]: VERCEL_BYPASS_SECRET,
      },
    })
    : fetch(url, options);
