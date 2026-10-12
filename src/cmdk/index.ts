export const COMMAND_K_MINIMUM_QUERY_LENGTH = 2;

export const filterCommandK = (
  value: string,
  search: string,
  keywords?: string[],
) => {
  const searchFormatted = search.trim().toLocaleLowerCase();
  return (
    value.toLocaleLowerCase().includes(searchFormatted) ||
    keywords?.some(keyword => keyword.includes(searchFormatted))
  ) ? 1 : 0;
};
