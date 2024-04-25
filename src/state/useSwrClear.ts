import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

export default function useSwrClear() {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(
    _key => false,
    undefined,
    { revalidate: false },
  ), [mutate]);
}
