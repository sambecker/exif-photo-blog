'use client';

import {
  Photo,
  PhotoSetAttributes,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageMedium from '@/components/image/ImageMedium';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';

export default function PhotoMedium({
  photo,
  tag,
  camera,
  simulation,
  focal,
  selected,
  priority,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  className,
  onVisible,
}: {
  photo: Photo
  selected?: boolean
  priority?: boolean
  prefetch?: boolean
  className?: string
  onVisible?: () => void
} & PhotoSetAttributes) {
  const ref = useRef<HTMLAnchorElement>(null);

  useOnVisible(ref, onVisible);

  return (
    <Link
      ref={ref}
      href={pathForPhoto({ photo, tag, camera, simulation, focal })}
      className={clsx(
        'active:brightness-75',
        selected && 'brightness-50',
        className,
      )}
      prefetch={prefetch}
    >
      <ImageMedium
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurDataURL={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        className="flex object-cover w-full h-full"
        imgClassName="object-cover w-full h-full"
        alt={altTextForPhoto(photo)}
        priority={priority}
      />
    </Link>
  );
};
