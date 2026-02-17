export const removeBase64Prefix = (base64: string) => {
  return base64.match(/^data:image\/[a-z]{3,4};base64,(.+)$/)?.[1] ?? base64;
};

export const fetchBase64ImageFromUrl = (
  url: string,
  fetchOptions?: RequestInit,
) =>
  fetch(url, fetchOptions)
    .then(async response => {
      const blob = await response.arrayBuffer();
      // eslint-disable-next-line max-len
      return `data:${response.headers.get('content-type')};base64,${Buffer.from(blob).toString('base64')}`;
    });
