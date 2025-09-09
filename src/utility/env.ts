const KEY_ALL = 'all';
const KEY_NONE = 'none';

export const parseCommaSeparatedStringList = <T>({
  string: _string,
  acceptedKeys,
  defaultKeys = [],
}: {
  string: string | undefined,
  acceptedKeys: readonly T[],
  defaultKeys?: T[],
}): T[] => {
  const string = (_string ?? '').trim().toLocaleLowerCase();
  if (string === KEY_ALL) {
    return acceptedKeys.slice();
  } else if (string === KEY_NONE) {
    return [];
  } else {
    return string
      ? string
        .split(',')
        .map(item => item.trim() as T)
        .filter(item => acceptedKeys.includes(item))
      : defaultKeys;
  }
};
