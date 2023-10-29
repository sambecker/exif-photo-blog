'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useTransition } from 'react';
import Spinner from '../components/Spinner';

export default function MorePhotos({
  path,
  triggerOnView = true,
  prefetch = true,
}: {
  path: string
  triggerOnView?: boolean
  prefetch?: boolean
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const advance = useCallback(() => startTransition(() => {
    router.push(path, { scroll: false });
  }), [router, path]);

  useEffect(() => {
    if (prefetch) {
      router.prefetch(path);
    }
  }, [router, path, prefetch]);

  useEffect(() => {
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

    observer.observe(buttonRef.current!);

    return () => observer.disconnect();
  }, [triggerOnView, advance, isPending]);

  return (
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
        : 'More photos'}
    </button>
  );
}
