'use client';

import { ReactNode, useCallback, useState } from 'react';
import {
  MoreComponentsContext,
  MoreComponentsKey,
  MoreComponentsState,
  MORE_COMPONENTS_INITIAL_STATE,
  MoreComponentsStateForKeyArgument,
} from './MoreComponentsState';

export default function MoreComponentsProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, setState] =
    useState<MoreComponentsState>(MORE_COMPONENTS_INITIAL_STATE);

  const setStateForKey = useCallback((
    key: MoreComponentsKey,
    state: MoreComponentsStateForKeyArgument
  ) => {
    setState(existingState => ({
      ...existingState,
      ...typeof state === 'function'
        ? { [key]: state(existingState[key]) }
        : { [key]: { ...existingState[key], ...state } },
    }));
  }, []);

  const clearMoreComponentsState = useCallback(() => {
    setState(MORE_COMPONENTS_INITIAL_STATE);
  }, []);

  return (
    <MoreComponentsContext.Provider
      value={{
        state,
        setStateForKey,
        clearMoreComponentsState,
      }}
    >
      {children}
    </MoreComponentsContext.Provider>
  );
}
