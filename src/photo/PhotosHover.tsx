'use client';

import { ComponentProps, ReactNode, useMemo } from 'react';
import EntityHover from '@/components/entity/EntityHover';
import SharedHover from '@/components/shared-hover/SharedHover';
import { Photo, photoQuantityText } from '@/photo';
import { useSharedHoverState } from '@/components/shared-hover/state';
import useSWR from 'swr';
import Spinner from '@/components/Spinner';
import { useAppText } from '@/i18n/state/client';
import { SWR_KEYS } from '@/swr';

export default function PhotosHover({
  hoverKey,
  header,
  getPhotos,
  photosCount,
  children,
  className,
  color,
}: {
  hoverKey: string
  header: ReactNode
  getPhotos: () => Promise<Photo[]>
  photosCount: number
  children: ReactNode
  className?: string
  color?: ComponentProps<typeof SharedHover>['color']
}) {
  const appText = useAppText();

  const { isHoverBeingShown } = useSharedHoverState();

  const isHovering = isHoverBeingShown?.(hoverKey);

  const {
    data: photos,
    isLoading,
  } = useSWR(
    isHovering ? `${SWR_KEYS.SHARED_HOVER}-${hoverKey}` : null,
    getPhotos, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });

  const caption = useMemo(() => <>
    {photoQuantityText(photosCount, appText, false)}
    {isLoading &&
      <Spinner size={9} />}
  </>, [photosCount, appText, isLoading]);

  return (
    <EntityHover {...{
      hoverKey,
      header,
      photos,
      photosCount,
      className,
      color,
      caption,
    }}>
      {children}
    </EntityHover>
  );
}
