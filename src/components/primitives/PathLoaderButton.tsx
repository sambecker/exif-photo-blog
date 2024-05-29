'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState, useTransition } from 'react';
import { SpinnerColor } from '../Spinner';
import LoaderButton from '@/components/primitives/LoaderButton';

export default function PathLoaderButton({
  path,
  icon,
  prefetch,
  loaderDelay = 100,
  shouldScroll = true,
  shouldReplace,
  spinnerColor,
  shouldPreventDefault,
  styleAs,
  hideTextOnMobile,
  className,
  children,
}: {
  path: string
  icon?: ReactNode
  prefetch?: boolean
  loaderDelay?: number
  shouldScroll?: boolean
  shouldReplace?: boolean
  spinnerColor?: SpinnerColor
  shouldPreventDefault?: boolean
  styleAs?: 'button' | 'link' | 'link-without-hover'
  hideTextOnMobile?: boolean
  className?: string
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
      className={className}
      onClick={e => {
        if (shouldPreventDefault) { e.preventDefault(); }
        startTransition(() => {
          if (shouldReplace) {
            router.replace(path, { scroll: shouldScroll });
          } else {
            router.push(path, { scroll: shouldScroll });
          }
        });
      }}
      isLoading={shouldShowLoader}
      spinnerColor={spinnerColor}
      styleAs={styleAs}
      hideTextOnMobile={hideTextOnMobile}
    >
      {children}
    </LoaderButton>
  );
}
