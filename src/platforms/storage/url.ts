// Kept free of storage SDK imports so client components can parse urls
export const getFileNamePartsFromStorageUrl = (url: string) => {
  const [
    _,
    urlBase = '',
    fileName = '',
    fileNameBase = '',
    fileId = '',
    fileModifier = '',
    fileExtension = '',
  ] = url.match(
    /^(.+)\/((-*[a-z0-9]+-*([a-z0-9]+)-*([a-z0-9]+)*)\.([a-z]{1,4}))$/i,
  ) ?? [];
  return {
    urlBase,
    fileName,
    fileNameBase,
    fileId,
    fileModifier,
    fileExtension,
  };
};
