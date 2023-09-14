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
