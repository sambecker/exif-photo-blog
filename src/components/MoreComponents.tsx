'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';

export default function MoreComponents({
  itemsPerRequest,
  componentLoader,
  label = 'Load more',
  triggerOnView = true,
  prefetch = true,
}: {
  itemsPerRequest: number
  componentLoader: (start: number, offset: number) => Promise<{
    component: JSX.Element,
    isFinished: boolean,
  }>
  label?: string
  triggerOnView?: boolean
  prefetch?: boolean
}) {
  const [offset, setOffset] = useState(2);
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    setIsLoading(true);
    const getMoreComponentsAsync = async () => {
      return componentLoader(0, itemsPerRequest * offset);
    };
    getMoreComponentsAsync()
      .then(({ component, isFinished }) => {
        setComponents([component]);
        setIsFinished(isFinished);
        setOffset(o => o + 1);
      })
      .finally(() => setIsLoading(false));
  }, [componentLoader, itemsPerRequest, offset]);

  // useEffect(() => {
  //   if (prefetch && components.length < offset) {
  //     console.log('prefetching');
  //     advance();
  //   }
  // }, [prefetch, advance, components.length, offset]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonRef.current) {
      const observer = new IntersectionObserver(e => {
        if (
          triggerOnView &&
          e[0].isIntersecting &&
          !isLoading
        ) {
          advance();
        }
      }, {
        root: null,
        threshold: 0,
      });
  
      observer.observe(buttonRef.current);
  
      return () => observer.disconnect();
    }
  }, [triggerOnView, advance, isLoading]);

  return <>
    {components}
    {!isFinished &&
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
