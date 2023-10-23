export const convertStringToArray = (
  string?: string,
  shouldParameterize = true,
) => string
  ? string.split(',').map(tag => shouldParameterize
    ? parameterize(tag)
    : tag.trim())
  : undefined;

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizeWords = (string = '') =>
  string
    .split(' ')
    .map(capitalize)
    .join(' ');

export const parameterize = (string: string) =>
  string
    .trim()
    .replaceAll(/\s+/g, '-')
    .toLowerCase();
