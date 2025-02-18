import {
  Photo,
  PhotoSetCategory,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageSmall from '@/components/image/ImageSmall';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/app/paths';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { useRef } from 'react';
import useVisible from '@/utility/useVisible';

export default function PhotoSmall({
  photo,
  tag,
  camera,
  simulation,
  focal,
  selected,
  className,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  onVisible,
}: {
  photo: Photo
  selected?: boolean
  className?: string
  prefetch?: boolean
  onVisible?: () => void
} & PhotoSetCategory) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisible({ ref, onVisible });

  return (
    <Link
      ref={ref}
      href={pathForPhoto({ photo, tag, camera, simulation, focal })}
      className={clsx(
        className,
        'active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
        'rounded-[3px] overflow-hidden',
        'border-main',
      )}
      prefetch={prefetch}
    >
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurDataURL={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        alt={altTextForPhoto(photo)}
      />
    </Link>
  );
};
