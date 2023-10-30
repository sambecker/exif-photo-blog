'use client';

import { useRouter } from 'next/navigation';
import IconButton from './IconButton';
import { useEffect, useState, useTransition } from 'react';
import { cc } from '@/utility/css';
import { SpinnerColor } from './Spinner';

export default function IconPathButton({
  icon,
  path,
  prefetch,
  loaderDelay = 250,
  shouldScroll = true,
  shouldReplace,
  spinnerColor,
}: {
  icon: JSX.Element
  path: string
  prefetch?: boolean
  loaderDelay?: number
  shouldScroll?: boolean
  shouldReplace?: boolean
  spinnerColor?: SpinnerColor
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
      onClick={() => startTransition(() => {
        if (shouldReplace) {
          router.replace(path, { scroll: shouldScroll });
        } else {
          router.push(path, { scroll: shouldScroll });
        }
      })}
      isLoading={shouldShowLoader}
      className={cc(
        'translate-y-[-0.5px]',
        'active:translate-y-[1px]',
        'text-medium',
        'active:text-gray-600 dark:active:text-gray-300',
      )}
      spinnerColor={spinnerColor ?? 'text'}
    />
  );
}
