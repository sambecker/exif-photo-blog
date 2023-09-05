export const cc = (
  ...classes: (string | boolean | undefined)[]
): string =>
  classes
    .filter(s => typeof s === 'string' && s.length)
    .join(' ');
