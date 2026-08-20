import { useSearchParams } from 'next/navigation';
import { useCallback, useSyncExternalStore } from 'react';

const HASH_CHANGE_EVENT = 'hashchange';

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener(HASH_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(HASH_CHANGE_EVENT, onStoreChange);
};

const getSnapshot = () => window.location.hash.replace('#', '');

const getSnapshotServer = () => '';

export default function useHash() {
  // `hashchange` doesn't fire for history updates made through the router,
  // so subscribing to search params re-renders—and therefore re-reads the
  // hash below—when those non-request-initiated changes happen
  useSearchParams();

  const hash = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshotServer,
  );

  const updateHash = useCallback((updatedHash: string) => {
    window.history.replaceState(null, '', `#${updatedHash}`);
  }, []);

  return { hash, updateHash };
}
