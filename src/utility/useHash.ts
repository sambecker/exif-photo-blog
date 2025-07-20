import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function useHash() {
  const [hash, setHash] = useState('');

  const updateHash = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener('hashchange', updateHash);
    return () => {
      window.removeEventListener('hashchange', updateHash);
    };
  }, [updateHash]);

  // Needed to capture non-request-initiated hash changes
  const params = useSearchParams();
  useEffect(() => {
    updateHash();
  }, [params, updateHash]);

  return hash.replace('#', '');
}
