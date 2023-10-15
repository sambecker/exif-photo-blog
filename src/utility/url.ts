// Remove protocol, www, and trailing slash from url
export const shortenUrl = (url?: string) => url
  ? url
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
    .replace(/\/$/, '')
  : undefined;

// Add protocol to url and remove trailing slash
export const makeUrlAbsolute = (url = '') =>
  (!url.startsWith('http')
    ? `https://${url}`
    : url).replace(/\/$/, '');
