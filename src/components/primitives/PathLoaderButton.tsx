'use client';

import { useRouter } from 'next/navigation';
import { ComponentProps, useEffect, useState, useTransition } from 'react';
import LoaderButton from '@/components/primitives/LoaderButton';

export default function PathLoaderButton({
  path,
  prefetch,
  loaderDelay = 100,
  shouldScroll = true,
  shouldReplace,
  children,
  ...props
}: {
  path: string
  prefetch?: boolean
  loaderDelay?: number
  shouldScroll?: boolean
  shouldReplace?: boolean
} & ComponentProps<typeof LoaderButton>) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  useEffect(() => {
    if (isPending) {
      const timeout = setTimeout(() => {
        setShouldShowLoader(true);
      }, loaderDelay);
      return () => clearTimeout(timeout);
    } else {
      setShouldShowLoader(false);
    }
  }, [isPending, loaderDelay]);

  useEffect(() => {
    if (prefetch) {
      router.prefetch(path);
    }
  }, [prefetch, router, path]);

  return (
    <LoaderButton
      {...props}
      onClick={() => {
        startTransition(() => {
          if (shouldReplace) {
            router.replace(path, { scroll: shouldScroll });
          } else {
            router.push(path, { scroll: shouldScroll });
          }
        });
      }}
      isLoading={shouldShowLoader}
    >
      {children}
    </LoaderButton>
  );
}
