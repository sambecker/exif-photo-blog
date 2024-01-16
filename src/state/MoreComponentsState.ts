import { createContext, useContext } from 'react';

export type MoreComponentsKey = 
  'PhotosLarge';

export interface MoreComponentsStateForKey {
  indexToView: number
  indexLoaded: number
  isLoading: boolean
  lastIndexToLoad?: number
  components: JSX.Element[]
}

export const createInitialStateForKey =
  (): MoreComponentsStateForKey => ({
    indexToView: 0,
    indexLoaded: 0,
    isLoading: false,
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
  PhotosLarge: createInitialStateForKey(),
};

export const  MoreComponentsContext =
  createContext<MoreComponentsContext>({
    state: MORE_COMPONENTS_INITIAL_STATE,
    setStateForKey: () => {},
  });

export const useMoreComponentsState = () =>
  useContext(MoreComponentsContext);
