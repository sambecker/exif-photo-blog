'use client';

import { ComponentProps, ReactNode, useMemo } from 'react';
import EntityHover from '@/components/entity/EntityHover';
import SharedHover from '@/components/shared-hover/SharedHover';
import {
  Photo,
  ogCaptionForPhoto,
  shouldShowExifDataForPhoto,
  titleForPhoto,
} from '@/photo';
import { pathForPhoto } from '@/app/path';
import { formatDate } from '@/utility/date';
import { AiFillApple } from 'react-icons/ai';
import { isCameraMakeApple } from '@/platforms/apple';
import clsx from 'clsx/lite';

export default function PhotoHover({
  photo,
  children,
  className,
  color,
}: {
  photo: Photo
  children: ReactNode
  className?: string
  color?: ComponentProps<typeof SharedHover>['color']
}) {
  const hoverKey = pathForPhoto({ photo });
  const exifText = ogCaptionForPhoto(photo);
  const showExif = shouldShowExifDataForPhoto(photo) && Boolean(exifText);
  const captionText = photo.title
    ? photo.title
    : (photo.takenAt || photo.createdAt)
      ? formatDate({
        date: photo.takenAt || photo.createdAt,
        length: 'medium',
      }).toLocaleUpperCase()
      : titleForPhoto(photo, false);

  const photos = useMemo(() => [photo], [photo]);

  const header = useMemo(() => showExif
    ? <span className={clsx(
      'flex items-center gap-1',
      'min-w-0',
    )}>
      {isCameraMakeApple(photo.make) &&
        <AiFillApple
          className="shrink-0 translate-y-[-0.5px]"
          size={14}
        />}
      <span className="truncate">{exifText}</span>
    </span>
    : undefined
  , [showExif, photo.make, exifText]);

  const caption = useMemo(() =>
    <span className="truncate">{captionText}</span>
  , [captionText]);

  return (
    <EntityHover {...{
      hoverKey,
      photos,
      photosCount: 1,
      className,
      color,
      header,
      caption,
    }}>
      {children}
    </EntityHover>
  );
}
