'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState, useTransition } from 'react';
import { SpinnerColor } from './Spinner';
import LoaderButton from '@/admin/LoaderButton';

export default function PathLoaderButton({
  path,
  icon,
  prefetch,
  loaderDelay = 100,
  shouldScroll = true,
  shouldReplace,
  spinnerColor,
  children,
}: {
  path: string
  icon?: JSX.Element
  prefetch?: boolean
  loaderDelay?: number
  shouldScroll?: boolean
  shouldReplace?: boolean
  spinnerColor?: SpinnerColor
  children?: ReactNode
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
    <LoaderButton
      icon={icon}
      onClick={() => startTransition(() => {
        if (shouldReplace) {
          router.replace(path, { scroll: shouldScroll });
        } else {
          router.push(path, { scroll: shouldScroll });
        }
      })}
      isLoading={shouldShowLoader}
      spinnerColor={spinnerColor}
    >
      {children}
    </LoaderButton>
  );
}
