export type PaginationSearchParams = { next: string };

export interface PaginationParams {
  searchParams?: PaginationSearchParams
}

export const getPaginationForSearchParams = (
  query?: PaginationSearchParams,
  limitPerOffset = 24,
) => {
  const offsetInt = parseInt(query?.next ?? '0');
  const offset = (Number.isNaN(offsetInt) ? 0 : offsetInt);
  return {
    offset,
    limit: limitPerOffset + offset * limitPerOffset,
  };
};
