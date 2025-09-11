const KEY_ALL = 'all';
const KEY_NONE = 'none';

export const parseCommaSeparatedKeyString = <T>({
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
export const getOrderedKeyListStatus = <T>({
  selectedKeys,
  acceptedKeys,
}: {
  selectedKeys: T[],
  acceptedKeys: readonly T[],
}): {
  label: string,
  selected: boolean,
}[] =>
  selectedKeys
    .map((key, index) => ({
      label: `${index + 1}.${key}`,
      selected: true,
    }))
    .concat(acceptedKeys
      .filter(key => !selectedKeys.includes(key))
      .map(key => ({
        label: `* ${key}`,
        selected: false,
      })));
