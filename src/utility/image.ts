import { getFileNamePartsFromStorageUrl } from '@/platforms/storage';

export const removeBase64Prefix = (base64: string) => {
  return base64.match(/^data:image\/[a-z]{3,4};base64,(.+)$/)?.[1] ?? base64;
};

export const fetchBase64ImageFromUrl = async (
  url: string,
  fetchOptions?: RequestInit,
) => {
  const { fileExtension } = getFileNamePartsFromStorageUrl(url);
  const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
  return fetch(url, fetchOptions)
    .then(async response => {
      if (response.ok) {
        const blob = await response.arrayBuffer();
        // eslint-disable-next-line max-len
        return `data:${contentType};base64,${Buffer.from(blob).toString('base64')}`;
      } else {
        return undefined;
      }
    })
    .catch(() => undefined);
};
