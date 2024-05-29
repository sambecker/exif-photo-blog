export const generateXPostText = (path: string, text: string) => {
  const url = new URL('https://x.com/intent/tweet');
  url.searchParams.set('url', path);
  url.searchParams.set('text', text);
  return url.toString();
};
