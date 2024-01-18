'use client';

import { useCallback, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';
import {
  MoreComponentsKey,
  MoreComponentsStateForKeyArgument,
  useMoreComponentsState,
} from '@/state/MoreComponentsState';

const MAX_ATTEMPTS_PER_REQUEST = 5;
const MAX_TOTAL_REQUESTS = 500;
const RETRY_DELAY_IN_SECONDS = 1.5;

export default function MoreComponents({
  stateKey,
  initialOffset,
  itemsPerRequest,
  getNextComponent,
  label = 'Load more',
  triggerOnView = true,
  prefetch = true,
}: {
  stateKey: MoreComponentsKey
  initialOffset: number
  itemsPerRequest: number
  getNextComponent: (offset: number, limit: number) => Promise<{
    nextComponent?: JSX.Element,
    isFinished?: boolean,
    didFail?: boolean,
  }>
  label?: string
  triggerOnView?: boolean
  prefetch?: boolean
}) {
  const { state, setStateForKey } = useMoreComponentsState();

  const setState = useCallback(
    (stateForKey: MoreComponentsStateForKeyArgument) =>
      setStateForKey(stateKey, stateForKey),
    [setStateForKey, stateKey]);

  const {
    indexToView,
    indexLoaded,
    isLoading,
    lastIndexToLoad,
    components,
  } = state[stateKey];

  // When prefetching, always stay one request ahead of what's visible
  const indexToLoad = lastIndexToLoad
    ?? (prefetch ? indexToView + 1 : indexToView);

  const attemptsPerRequest = useRef(0);
  const totalRequests = useRef(0);

  const showMoreButton = (
    lastIndexToLoad === undefined ||
    lastIndexToLoad > indexToView
  ) && (
    attemptsPerRequest.current < MAX_ATTEMPTS_PER_REQUEST &&
    totalRequests.current < MAX_TOTAL_REQUESTS
  );

  const attempt = useCallback(() => {
    const handleError = () => {
      setTimeout(() => {
        attempt();
      }, RETRY_DELAY_IN_SECONDS * 1000);
    };
    if (attemptsPerRequest.current < MAX_ATTEMPTS_PER_REQUEST) {
      if (totalRequests.current < MAX_TOTAL_REQUESTS) {
        attemptsPerRequest.current += 1;
        totalRequests.current += 1;
        setState({ isLoading: true });
        getNextComponent(
          initialOffset + (indexToLoad - 1) * itemsPerRequest,
          itemsPerRequest,
        )
          .then(({ nextComponent, isFinished, didFail }) => {
            if (!didFail && nextComponent) {
              setState(state => {
                const updatedComponents = [...state.components];
                updatedComponents[indexToLoad] = nextComponent;
                return {
                  ...state,
                  components: updatedComponents,
                  indexLoaded: indexToLoad,
                  isLoading: false,
                  ...isFinished && { lastIndexToLoad: indexToLoad },
                };
              });
              attemptsPerRequest.current = 0;
            } else {
              handleError();
            }
          })
          .catch(handleError);
      } else {
        console.error(
          `Max total attempts reached (${MAX_TOTAL_REQUESTS})`
        );
        setState({ isLoading: false });
      }
    } else {
      console.error(
        `Max attempts per request reached ${MAX_ATTEMPTS_PER_REQUEST}`
      );
      setState({
        isLoading: false,
        haveAttemptsPerRequestBeenExceeded: true,
      });
    }
  }, [
    setState,
    getNextComponent,
    initialOffset,
    indexToLoad,
    itemsPerRequest,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      indexToLoad >= indexToView &&
      indexToLoad > indexLoaded
    ) {
      console.log('Attempting', { isLoading });
      attempt();
    }
  }, [
    isLoading,
    indexToLoad,
    indexToView,
    indexLoaded,
    attempt,
  ]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    if (indexToView <= indexLoaded) {
      setState({ indexToView: indexToView + 1 });
    }
  }, [setState, indexToView, indexLoaded]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonRef.current) {
      const observer = new IntersectionObserver(e => {
        if (triggerOnView && e[0].isIntersecting) {
          advance();
        }
      }, {
        root: null,
        threshold: 0,
      });
      observer.observe(buttonRef.current);
      return () => observer.disconnect();
    }
  }, [triggerOnView, advance]);

  return <>
    {components.slice(0, indexToView + 1)}
    {showMoreButton &&
      <SiteGrid
        contentMain={
          <button
            ref={buttonRef}
            className="block w-full mt-4 subtle"
            onClick={!triggerOnView ? advance : undefined}
            disabled={triggerOnView || isLoading}
          >
            {isLoading || triggerOnView
              ? <span className="relative inline-block translate-y-[3px]">
                <Spinner size={16} />
              </span>
              : label}
          </button>}
      />}
  </>;
}
