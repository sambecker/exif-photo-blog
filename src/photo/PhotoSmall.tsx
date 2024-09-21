import {
  Photo,
  PhotoSetAttributes,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageSmall from '@/components/image/ImageSmall';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';

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
} & PhotoSetAttributes) {
  const ref = useRef<HTMLAnchorElement>(null);

  useOnVisible(ref, onVisible);

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
        'border-subtle',
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
