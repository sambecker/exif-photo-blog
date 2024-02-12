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
const MAX_TOTAL_REQUESTS = 100;
const RETRY_DELAY_IN_SECONDS = 1;

export default function MoreComponents({
  stateKey,
  initialOffset,
  itemsPerRequest,
  getNextComponent,
  label = 'Load more',
  triggerOnView = true,
  prefetch = true,
  wrapMoreButtonInSiteGrid,
  debug,
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
  wrapMoreButtonInSiteGrid?: boolean
  debug?: boolean
}) {
  const { state, setStateForKey } = useMoreComponentsState();

  const setState = useCallback(
    (stateForKey: MoreComponentsStateForKeyArgument) =>
      setStateForKey(stateKey, stateForKey),
    [setStateForKey, stateKey]);

  const {
    isLoading,
    indexInView,
    finalIndex,
    didReachMaximumRequests,
    components,
  } = state[stateKey];

  // When prefetching, always stay one request ahead of what's visible
  const furthestIndexToLoad = Math.min(
    prefetch ? (indexInView ?? 0) + 1 : (indexInView ?? 0),
    finalIndex ?? Infinity,
  );

  const indexToLoad = Math.min(
    components.length,
    furthestIndexToLoad,
  );

  const attemptsPerRequest = useRef(0);
  const totalRequests = useRef(0);

  const showMoreButton =
    isLoading ||
    finalIndex === undefined ||
    finalIndex >= components.length;

  const currentTimeout = useRef<NodeJS.Timeout>();

  const attempt = useCallback(() => {
    const handleError = () => {
      if (currentTimeout.current) {
        clearTimeout(currentTimeout.current);
      }
      currentTimeout.current =
        setTimeout(attempt, RETRY_DELAY_IN_SECONDS * 1000);
    };
    if (attemptsPerRequest.current < MAX_ATTEMPTS_PER_REQUEST) {
      if (totalRequests.current < MAX_TOTAL_REQUESTS) {
        attemptsPerRequest.current += 1;
        totalRequests.current += 1;
        setState({ isLoading: true });
        if (debug) {
          // eslint-disable-next-line max-len
          console.log(`GETTING INDEX: #${indexToLoad}, ATTEMPT: #${attemptsPerRequest.current}`);
        }
        getNextComponent(
          initialOffset + indexToLoad * itemsPerRequest,
          itemsPerRequest,
        )
          .then(({ nextComponent, isFinished, didFail }) => {
            if (!didFail) {
              attemptsPerRequest.current = 0;
              setState(state => {
                const updatedComponents = [...state.components];
                if (nextComponent) {
                  updatedComponents[indexToLoad] = nextComponent;
                }
                return {
                  ...state,
                  ...nextComponent && { components: updatedComponents},
                  latestIndexLoaded: indexToLoad,
                  isLoading: false,
                  didReachMaximumRequests: false,
                  ...isFinished && { finalIndex: indexToLoad },
                };
              });
            } else {
              handleError();
            }
          })
          .catch(handleError);
      } else {
        console.log(
          `Max total attempts reached (${MAX_TOTAL_REQUESTS})`
        );
        setState({
          isLoading: false,
          didReachMaximumRequests: true,
        });
      }
    } else {
      console.log(
        `Max attempts per request reached ${MAX_ATTEMPTS_PER_REQUEST}`
      );
      setState({
        isLoading: false,
        didReachMaximumRequests: true,
      });
    }
  }, [
    setState,
    getNextComponent,
    initialOffset,
    indexToLoad,
    itemsPerRequest,
    debug,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      indexToLoad >= components.length
    ) {
      attempt();
    }
  }, [isLoading, indexToLoad, indexInView, attempt, components.length]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const resetRequestsAndRetry = useCallback(() => {
    attemptsPerRequest.current = 0;
    totalRequests.current = 0;
    setState({ didReachMaximumRequests: false });
    attempt();
  }, [attempt, setState]);

  const advance = useCallback(() => {
    if (indexInView === undefined) {
      setState({ indexInView: 0 });
    } else if (
      (indexInView <= components.length) &&
      (finalIndex === undefined || indexInView < finalIndex)      
    ) {
      setState({ indexInView: indexInView + 1});
    }
  }, [components.length, finalIndex, indexInView, setState]);

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

  const renderMoreButton = () => 
    <button
      ref={buttonRef}
      className="block w-full subtle"
      onClick={didReachMaximumRequests ? resetRequestsAndRetry : advance}
      disabled={isLoading}
    >
      {isLoading
        ? <span className="relative inline-block translate-y-[3px]">
          <Spinner size={16} />
        </span>
        : didReachMaximumRequests
          ? 'Try again …'
          : label}
    </button>;

  return <>
    <div className="space-y-4">
      <div>{components.slice(0, (indexInView ?? 0) + 1)}</div>
      {showMoreButton && (
        wrapMoreButtonInSiteGrid
          ? <SiteGrid contentMain={renderMoreButton()} />
          : renderMoreButton()
      )}
    </div>
  </>;
}
