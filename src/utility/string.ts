export const convertStringToArray = (
  string?: string,
  shouldParameterize = true,
) => string
  ? string.split(',').map(item => shouldParameterize
    ? parameterize(item)
    : item.trim())
  : undefined;

export const capitalize = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizeWords = (string = '') =>
  string
    .split(' ')
    .map(capitalize)
    .join(' ');

export const parameterize = (
  string: string,
  shouldRemoveNonAlphanumeric?: boolean,
) =>
  string
    .trim()
    // Replaces spaces, underscores, and dashes with dashes
    .replaceAll(/[\s_–—]/gi, '-')
    // Removes punctuation
    .replaceAll(/['"!@#$%^&*()_+=[\]{};:/?,.<>\\|`~]/gi, '')
    // Removes all non-alphanumeric characters
    .replaceAll(
      shouldRemoveNonAlphanumeric
        ? /([^a-z0-9-])/gi
        : /''/gi,
      '',
    )
    .toLocaleLowerCase();

export const formatCount = (count: number) => `× ${count}`;

export const formatCountDescriptive = (
  count: number,
  verb = 'found',
  noun = 'photo',
  singular = '',
  plural = 's',
) =>
  `${verb} in ${count} ${noun}${count === 1 ? singular : plural}`;
