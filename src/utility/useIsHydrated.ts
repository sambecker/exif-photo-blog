import { useSyncExternalStore } from 'react';

// Gates values that only exist on the client. React resolves the divergence
// as part of hydration, so the correct value paints immediately—unlike a
// setState-in-effect flag, which paints the server value first
const subscribe = () => () => {};

const getSnapshot = () => true;

const getSnapshotServer = () => false;

export default function useIsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshotServer);
}
