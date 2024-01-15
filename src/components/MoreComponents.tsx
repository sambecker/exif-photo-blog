'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';

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
    nextComponent: JSX.Element,
    isFinished: boolean,
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

  const indexToLoad = lastIndexToLoad
    ?? (prefetch ? indexToView + 1 : indexToView);

  useEffect(() => {
    if (
      !isLoading &&
      // (lastIndexToLoad === undefined || indexToLoad <= lastIndexToLoad) &&
      // indexToLoad >= 1 &&
      indexToLoad > indexToView &&
      indexToLoad > indexLoaded
    ) {
      setIsLoading(true);
      getNextComponent(
        initialOffset + (indexToLoad - 1) * itemsPerRequest,
        itemsPerRequest,
      )
        .then(({ nextComponent, isFinished }) => {
          setComponents(current => {
            const updatedComponents = [...current];
            updatedComponents[indexToLoad] = nextComponent;
            return updatedComponents;
          });
          setIndexLoaded(indexToLoad);
          if (isFinished) {
            setLastIndexToLoad(indexToLoad);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [
    isLoading,
    // lastIndexToLoad,
    indexToLoad,
    indexToView,
    indexLoaded,
    getNextComponent,
    initialOffset,
    itemsPerRequest,
  ]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    if (indexToView < indexLoaded) {
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

  // console.log({
  //   indexToLoad,
  //   indexToView,
  //   // indexLoaded,
  //   lastIndexToLoad,
  //   componentsLength: components.length,
  //   componentsToView: components.slice(0, indexToView + 1).length,
  // });

  return <>
    {components.slice(0, indexToView + 1)}
    {indexToView < indexLoaded &&
      <SiteGrid
        contentMain={
          <button
            ref={buttonRef}
            className="block w-full mt-4 subtle"
            onClick={!triggerOnView ? advance : undefined}
            disabled={triggerOnView || isLoading}
          >
            {isLoading
              ? <span className="relative inline-block translate-y-[3px]">
                <Spinner size={16} />
              </span>
              : label}
          </button>}
      />}
  </>;
}
