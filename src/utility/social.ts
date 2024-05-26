export const generateXPostText = (path: string, text: string) => {
  const url = new URL('https://x.com/intent/post');
  url.searchParams.set('text', text);
  url.searchParams.set('url', path);
  return url.toString();
};
