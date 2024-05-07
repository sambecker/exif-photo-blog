'use client';

import { Photo, altTextForPhoto, doesPhotoNeedBlurCompatibility } from '.';
import ImageSmall from '@/components/ImageSmall';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';

export default function PhotoSmall({
  photo,
  tag,
  camera,
  simulation,
  selected,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  onVisible,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  selected?: boolean
  priority?: boolean
  prefetch?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useOnVisible(ref, onVisible);

  return (
    <Link
      ref={ref}
      href={pathForPhoto(photo, tag, camera, simulation)}
      className={clsx(
        'flex w-full h-full',
        'active:brightness-75',
        selected && 'brightness-50',
      )}
      prefetch={prefetch}
    >
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        className="w-full"
        alt={altTextForPhoto(photo)}
        priority={priority}
      />
    </Link>
  );
};
