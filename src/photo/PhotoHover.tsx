'use client';

import { ComponentProps, ReactNode, useMemo } from 'react';
import SharedHover from '@/components/shared-hover/SharedHover';
import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
  ogCaptionForPhoto,
  shouldShowExifDataForPhoto,
  titleForPhoto,
} from '@/photo';
import { getDimensionsFromSize } from '@/utility/size';
import ImageMedium from '@/components/image/ImageMedium';
import clsx from 'clsx/lite';
import { pathForPhoto } from '@/app/path';
import { formatDate } from '@/utility/date';
import { AiFillApple } from 'react-icons/ai';
import { isCameraMakeApple } from '@/platforms/apple';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

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
  const caption = photo.title
    ? photo.title
    : (photo.takenAt || photo.createdAt)
      ? formatDate({
        date: photo.takenAt || photo.createdAt,
        length: 'medium',
      }).toLocaleUpperCase()
      : titleForPhoto(photo, false);

  const content = useMemo(() =>
    <div className="relative w-full h-full">
      <ImageMedium
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurDataURL={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        className="flex object-cover w-full h-full"
        classNameImage="object-cover w-full h-full"
        alt={altTextForPhoto(photo)}
      />
      <div className={clsx(
        'absolute inset-0',
        'bg-gradient-to-b from-black/70 to-transparent',
      )} />
      <div className="absolute inset-0 p-2.5">
        <div className="flex flex-col gap-1 h-full">
          <div className="grow">
            {showExif &&
              <span className={clsx(
                'flex items-center gap-1',
                'text-base text-white',
                'translate-x-[4px]',
              )}>
                {isCameraMakeApple(photo.make) &&
                  <AiFillApple
                    className="shrink-0 translate-y-[-0.5px]"
                    size={14}
                  />}
                <span className="truncate">{exifText}</span>
              </span>}
          </div>
          <div className={clsx(
            'self-start',
            'flex items-center gap-1',
            'px-1.5 py-0.5 rounded-sm',
            'text-white/90 bg-black/40 backdrop-blur-lg',
            'outline-medium shadow-sm',
            'uppercase text-[0.7rem]',
          )}>
            <span className="truncate">{caption}</span>
          </div>
        </div>
      </div>
    </div>
  , [photo, exifText, showExif, caption]);

  return (
    <SharedHover {...{
      hoverKey,
      content,
      className,
      width,
      height,
      color,
    }}>
      {children}
    </SharedHover>
  );
}
