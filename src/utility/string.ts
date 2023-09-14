export const isValidUUID = (id: string): boolean =>
  /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/i.test(id);

export const convertStringToArray = (
  string?: string,
  parameterize = true,
) => string
  ? string.split(',').map(tag => parameterize
    ? tag.trim().replaceAll(' ', '-').toLowerCase()
    : tag.trim())
  : undefined;

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizeWords = (string: string) =>
  string
    .split(' ')
    .map(capitalize)
    .join(' ');
