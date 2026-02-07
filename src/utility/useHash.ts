import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useHash() {
  const [hash, setHash] = useState('');

  const storeHash = useCallback(() => {
    setHash(window.location.hash.replace('#', ''));
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', storeHash);
    return () => {
      window.removeEventListener('hashchange', storeHash);
    };
  }, [storeHash]);

  // Needed to capture non-request-initiated hash changes
  const params = useSearchParams();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(storeHash, [params, storeHash]);

  const updateWindowHash = useCallback((hash: string) => {
    window.history.replaceState(null, '', `#${hash}`);
  }, []);

  return {
    hash,
    updateHash: updateWindowHash,
  };
}
