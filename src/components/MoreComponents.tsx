'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';

const MAX_ATTEMPTS_PER_REQUEST = 5;
const MAX_TOTAL_REQUESTS = 500;
const RETRY_DELAY_IN_SECONDS = 1.5;

export default function MoreComponents({
  initialOffset,
  itemsPerRequest,
  getNextComponent,
  label = 'Load more',
  triggerOnView = true,
  prefetch = true,
}: {
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
  const [indexToView, setIndexToView] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastIndexToLoad, setLastIndexToLoad] = useState<number>();
  const [components, setComponents] = useState<JSX.Element[]>([]);

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
    if (attemptsPerRequest.current < MAX_ATTEMPTS_PER_REQUEST) {
      if (totalRequests.current < MAX_TOTAL_REQUESTS) {
        attemptsPerRequest.current += 1;
        totalRequests.current += 1;
        setIsLoading(true);
        const handleError = () => {
          setTimeout(() => {
            attempt();
          }, RETRY_DELAY_IN_SECONDS * 1000);
        };
        getNextComponent(
          initialOffset + (indexToLoad - 1) * itemsPerRequest,
          itemsPerRequest,
        )
          .then(({ nextComponent, isFinished, didFail }) => {
            if (!didFail && nextComponent) {
              setComponents(current => {
                const updatedComponents = [...current];
                updatedComponents[indexToLoad] = nextComponent;
                return updatedComponents;
              });
              setIndexLoaded(indexToLoad);
              if (isFinished) {
                setLastIndexToLoad(indexToLoad);
              }
              attemptsPerRequest.current = 0;
            } else {
              handleError();
            }
          })
          .catch(handleError)
          .finally(() => setIsLoading(false));
      } else {
        console.error(
          `Max total attempts reached (${MAX_TOTAL_REQUESTS})`
        );
      }
    } else {
      console.error(
        `Max attempts per request reached ${MAX_ATTEMPTS_PER_REQUEST}`
      );
    }
  }, [
    getNextComponent,
    indexToLoad,
    initialOffset,
    itemsPerRequest,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      indexToLoad >= indexToView &&
      indexToLoad > indexLoaded
    ) {
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
      setIndexToView(i => i + 1);
    }
  }, [indexToView, indexLoaded]);

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
