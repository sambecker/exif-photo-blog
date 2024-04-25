'use client';

import { useCallback } from 'react';
import { useSWRConfig } from 'swr';

export default function useSwrClear() {
  const { mutate } = useSWRConfig();
  return useCallback(() => mutate(
    _key => true,
    undefined,
    { revalidate: false },
  ), [mutate]);
}
