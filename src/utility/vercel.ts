import { IS_PREVIEW, VERCEL_BYPASS_SECRET } from "@/site/config";

export const fetchBypass: typeof fetch = (url, options) =>
  IS_PREVIEW && VERCEL_BYPASS_SECRET
  ? fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'x-vercel-protection-bypass': VERCEL_BYPASS_SECRET
    },
  })
  : fetch(url, options);
