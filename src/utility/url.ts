// Remove protocol, www, and trailing slash from url
export const shortenUrl = (url?: string) =>
  url
    ? url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/\/$/, '')
    : undefined;

// Remove protocol, and trailing slash from url
export const removeUrlProtocol = (url?: string) =>
  url ? url.replace(/^(?:https?:\/\/)?/i, '').replace(/\/$/, '') : undefined;

// Add protocol to url and remove trailing slash
export const makeUrlAbsolute = (url?: string) =>
  url !== undefined
    ? (!url.startsWith('http') ? `https://${url}` : url).replace(/\/$/, '')
    : undefined;

export const removeParamsFromUrl = (urlString: string, params: string[]) => {
  const url = new URL(urlString);
  for (const param of params) {
    url.searchParams.delete(param);
  }
  return url.toString();
};

export const downloadFileFromBrowser = async (
  url: string,
  fileName: string,
) => {
  const blob = await fetch(url).then((response) => response.blob());
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// Necessary for useClientSearchParams to see window.location changes,
// particularly for paths that only change query params
export const replacePathWithEvent = (pathname: string) => {
  window.history.pushState(null, '', pathname);
  dispatchEvent(new Event('replacestate'));
};

export const fixLocalhostUrlForNode = (url: string) => {
  if (
    url.startsWith('http://localhost:9000') ||
    url.startsWith('http://127.0.0.1:9000')
  ) {
    return url.replace(
      /http:\/\/(localhost|127\.0\.0\.1):9000/i,
      'http://minio:9000',
    );
  }
  if (
    url.startsWith('http://localhost:8080') ||
    url.startsWith('http://127.0.0.1:8080')
  ) {
    return url.replace(
      /http:\/\/(localhost|127\.0\.0\.1):8080/i,
      'http://imgproxy:8080',
    );
  }
  return url.replace(/^http:\/\/localhost/i, 'http://127.0.0.1');
};
