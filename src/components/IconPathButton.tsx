'use client';

import { useRouter } from 'next/navigation';
import IconButton from './IconButton';
import { useEffect, useState, useTransition } from 'react';
import { cc } from '@/utility/css';

export default function IconPathButton({
  icon,
  path,
  prefetch,
  loaderDelay = 250,
  shouldScroll = true,
}: {
  icon: JSX.Element
  path: string
  prefetch?: boolean
  loaderDelay?: number
  shouldScroll?: boolean
}) {
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
    <IconButton
      icon={icon}
      onClick={() => startTransition(() =>
        router.push(path, { scroll: shouldScroll }))}
      isLoading={shouldShowLoader}
      className={cc(
        'translate-y-[-0.5px]',
        'active:translate-y-[1px]',
        'text-gray-500 active:text-gray-600',
        'dark:text-gray-400 dark:active:text-gray-300',
      )}
      spinnerColor="text"
    />
  );
}
