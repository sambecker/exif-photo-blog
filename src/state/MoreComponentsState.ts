import { createContext, useContext } from 'react';

export type MoreComponentsKey = 
  'PhotosRoot' |
  'PhotosGrid';

export interface MoreComponentsStateForKey {
  hasMounted: boolean
  isLoading: boolean
  indexInView?: number
  finalIndex?: number
  didReachMaximumRequests: boolean
  components: JSX.Element[]
}

export const createInitialStateForKey =
  (): MoreComponentsStateForKey => ({
    hasMounted: false,
    isLoading: false,
    didReachMaximumRequests: false,
    components: [],
  });

export type MoreComponentsState = Record<
  MoreComponentsKey,
  MoreComponentsStateForKey
>;

export type MoreComponentsStateForKeyArgument = 
  Partial<MoreComponentsStateForKey> |
  ((existingValue: MoreComponentsStateForKey) => MoreComponentsStateForKey);

export interface MoreComponentsContext {
  state: MoreComponentsState
  setStateForKey: (
    key: MoreComponentsKey,
    state: MoreComponentsStateForKeyArgument,
  ) => void
}

export const MORE_COMPONENTS_INITIAL_STATE: MoreComponentsState = {
  PhotosRoot: createInitialStateForKey(),
  PhotosGrid: createInitialStateForKey(),
};

export const  MoreComponentsContext =
  createContext<MoreComponentsContext>({
    state: MORE_COMPONENTS_INITIAL_STATE,
    setStateForKey: () => {},
  });

export const useMoreComponentsState = () =>
  useContext(MoreComponentsContext);
