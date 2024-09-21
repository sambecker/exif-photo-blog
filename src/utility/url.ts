// Remove protocol, www, and trailing slash from url
export const shortenUrl = (url?: string) => url
  ? url
    .replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
    .replace(/\/$/, '')
  : undefined;

// Add protocol to url and remove trailing slash
export const makeUrlAbsolute = (url?: string) => url !== undefined
  ? (!url.startsWith('http') ? `https://${url}` : url)
    .replace(/\/$/, '')
  : undefined;

export const downloadFileFromBrowser = async (
  url: string,
  fileName: string,
) => {
  const blob = await fetch(url)
    .then(response => response.blob());
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};
