'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Spinner from './Spinner';
import SiteGrid from './SiteGrid';

export default function MoreComponents({
  itemsPerRequest,
  itemsTotalCount,
  componentLoader,
  label = 'Load more',
  triggerOnView = true,
}: {
  itemsPerRequest: number
  itemsTotalCount: number
  componentLoader: (limit: number) => Promise<JSX.Element>
  label?: string
  triggerOnView?: boolean
  prefetch?: boolean
}) {
  const [offset, setOffset] = useState(2);
  const [components, setComponents] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => {
    setIsLoading(true);
    const getMoreComponentsAsync = async () => {
      return componentLoader(itemsPerRequest * offset);
    };
    getMoreComponentsAsync()
      .then(component => {
        setComponents([component]);
        setOffset(o => o + 1);
      })
      .finally(() => setIsLoading(false));
  }, [componentLoader, itemsPerRequest, offset]);

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

  const showMoreButton = itemsTotalCount > itemsPerRequest * (offset - 1);

  return <>
    {components}
    {showMoreButton &&
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
