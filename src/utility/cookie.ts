export const storeCookie = (
  name: string,
  value: string,
  path= '/',
  maxAge = 63158400,
  sameSite = 'Lax',
) => {
  if (typeof document !== 'undefined') {
    document.cookie =
      `${name}=${value};Path=${path};Max-Age=${maxAge};SameSite=${sameSite}`;
  }
};

export const getCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    const cookie: Record<string, string> = {};
    document.cookie.split(';').forEach(function(el) {
      const split = el.split('=');
      cookie[split[0].trim()] = split.slice(1).join('=');
    });
    return cookie[name];
  }
};

export const deleteCookie = (name: string) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=;Max-Age=0`;
  }
};
