'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import Spinner from './Spinner';

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
  const [offset, setOffset] = useState(1);
  const [components, setComponents] = useState<JSX.Element[]>([]);

  const [isPending, startTransition] = useTransition();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => startTransition(() => {
    const getMoreComponentsAsync = async () => {
      return componentLoader(itemsPerRequest * offset);
    };
    getMoreComponentsAsync().then((component) => {
      setComponents([component]);
      setOffset(o => o + 1);
    });
  }), [componentLoader, itemsPerRequest, offset]);

  useEffect(() => {
    // Only add observer if button is rendered
    if (buttonRef.current) {
      const observer = new IntersectionObserver(e => {
        if (
          triggerOnView &&
          e[0].isIntersecting &&
          !isPending
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
  }, [triggerOnView, advance, isPending]);

  const showMoreButton = itemsTotalCount > itemsPerRequest * offset;

  return <div className="space-y-4">
    {components}
    {showMoreButton &&
      <button
        ref={buttonRef}
        className="block w-full subtle"
        onClick={!triggerOnView ? advance : undefined}
        disabled={triggerOnView || isPending}
      >
        {isPending
          ? <span className="relative inline-block translate-y-[3px]">
            <Spinner size={16} />
          </span>
          : label}
      </button>}
  </div>;
}
