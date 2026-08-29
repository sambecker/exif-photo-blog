import { useSyncExternalStore } from 'react';

const APPLE_PLATFORM = /mac|iphone|ipad|ipod/i;

// Platform can't be read while rendering on the server, so the server snapshot
// assumes ⌘ and React swaps in the real value as part of hydration—avoiding
// both a mismatch and a setState-in-effect pass

const subscribe = () => () => {};
const getSnapshot = () => APPLE_PLATFORM.test(navigator.platform);
const getSnapshotServer = () => true;

export default function useIsApplePlatform() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshotServer);
}
