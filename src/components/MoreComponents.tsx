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
  const [indexToLoad, setIndexToLoad] = useState(prefetch ? 1 : 0);
  const [indexToView, setIndexToView] = useState(0);
  const [indexLoaded, setIndexLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isLoading && indexToLoad > indexLoaded) {
      setIsLoading(true);
      getNextComponent(
        initialOffset + (indexToLoad - 1) * itemsPerRequest,
        itemsPerRequest,
      )
        .then(({ nextComponent, isFinished }) => {
          setComponents(current => [...current, nextComponent]);
          setIsFinished(isFinished);
          setIndexLoaded(i => i + 1);
        })
        .finally(() => setIsLoading(false));
    }
  }, [
    isLoading,
    indexToLoad,
    indexLoaded,
    getNextComponent,
    initialOffset,
    itemsPerRequest,
  ]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    if (!isFinished && !isLoading) {
      setIndexToLoad(i => i + 1); 
    }
    if (indexToView < indexToLoad) {
      setIndexToView(i => i + 1);
    }
  }, [isLoading, isFinished, indexToView, indexToLoad]);

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
    {components.slice(0, indexToView)}
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
