export const convertStringToArray = (
  string?: string,
  shouldParameterize = true,
) => string
  ? string.split(',').map(item => shouldParameterize
    ? parameterize(item)
    : item.trim())
  : undefined;

export const capitalize = (string: string) =>
  string.charAt(0).toLocaleUpperCase() + string.slice(1);

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
    // Replace spaces, underscores, slashes, pluses, dashes with dashes
    .replaceAll(/[\s_–—+]/gi, '-')
    // Remove punctuation
    .replaceAll(/['"!@#$%^&*()=[\]{};:/?,<>\\/|`~]/gi, '')
    // Removes non-alphanumeric characters, if configured
    .replaceAll(
      shouldRemoveNonAlphanumeric
        ? /([^a-z0-9-])/gi
        : /''/gi,
      '',
    )
    .toLocaleLowerCase();

export const deparameterize = (string: string) =>
  capitalizeWords(string.replaceAll('-', ' '));

export const formatCount = (count: number) => `× ${count}`;

export const pluralize = (
  count: number,
  singular: string,
  plural?: string,
  padPlaces = 0,
) =>{
  const numberFormatted = padPlaces
    ? String(count).padStart(padPlaces, '0')
    : count;
  const label = count === 1 ? singular : plural ?? `${singular}s`;
  return `${numberFormatted} ${label}`;
};

export const depluralize = (string: string) =>
  // Handle plurals like "lenses"
  /ses$/i.test(string)
    ? string.replace(/es$/i, '')
    : string.replace(/s$/i, '');

export const formatCountDescriptive = (
  count: number,
  verb = 'found',
  noun = 'photo',
  singular = '',
  plural = 's',
) =>
  `${verb} in ${count} ${noun}${count === 1 ? singular : plural}`;
