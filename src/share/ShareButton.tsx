'use client';

import { TbPhotoShare } from 'react-icons/tb';
import { clsx } from 'clsx/lite';
import LoaderButton from '@/components/primitives/LoaderButton';
import { useAppState } from '@/app/AppState';
import { getSharePathFromShareModalProps, ShareModalProps } from '.';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppText } from '@/i18n/state/client';

let prefetchedImage: HTMLImageElement | null = null;

export default function ShareButton({
  dim,
  prefetch,
  className,
  tooltip,
  ...rest
}: {
  dim?: boolean
  prefetch?: boolean
  className?: string
  tooltip?: string
} & ShareModalProps) {
  const { setShareModalProps } = useAppState();

  const router = useRouter();

  const appText = useAppText();

  const absoluteImagePath = getSharePathFromShareModalProps({ ...rest });

  useEffect(() => {
    if (prefetch && absoluteImagePath) {
      prefetchedImage = new Image();
      prefetchedImage.src = absoluteImagePath;
    }
  }, [prefetch, absoluteImagePath, router]);

  const tooltipText = tooltip ?? appText.tooltip.sharePhoto;

  return (
    <LoaderButton
      tooltip={tooltipText}
      aria-label={tooltipText}
      onClick={() => setShareModalProps?.({ ...rest })}
      className={clsx(
        className,
        dim ? 'text-dim' : 'text-medium',
      )}
      icon={<TbPhotoShare size={16} />}
      spinnerColor="dim"
      styleAs="link"
      hideFocusOutline
    />
  );
}
