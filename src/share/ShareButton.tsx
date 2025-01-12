'use client';

import { TbPhotoShare } from 'react-icons/tb';
import { clsx } from 'clsx/lite';
import LoaderButton from '@/components/primitives/LoaderButton';
import { useAppState } from '@/state/AppState';
import { getSharePathFromShareModalProps, ShareModalProps } from '.';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

let prefetchedImage: HTMLImageElement | null = null;

export default function ShareButton({
  dim,
  prefetch,
  className,
  ...rest
}: {
  dim?: boolean
  prefetch?: boolean
  className?: string
} & ShareModalProps) {
  const { setShareModalProps } = useAppState();

  const router = useRouter();

  const absoluteImagePath = getSharePathFromShareModalProps({ ...rest });

  useEffect(() => {
    if (prefetch && absoluteImagePath) {
      prefetchedImage = new Image();
      prefetchedImage.src = absoluteImagePath;
    }
  }, [prefetch, absoluteImagePath, router]);

  return (
    <LoaderButton
      onClick={() => setShareModalProps?.({ ...rest })}
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
      )}
      icon={<TbPhotoShare size={16} />}
      spinnerColor="dim"
      styleAs="link"
    />
  );
}
