import { Photo, altTextForPhoto, doesPhotoNeedBlurCompatibility } from '.';
import ImageTiny from '@/components/ImageTiny';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/site/config';
import { useRef } from 'react';
import useOnVisible from '@/utility/useOnVisible';

export default function PhotoTiny({
  photo,
  tag,
  selected,
  className,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  onVisible,
}: {
  photo: Photo
  tag?: string
  selected?: boolean
  className?: string
  prefetch?: boolean
  onVisible?: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useOnVisible(ref, onVisible);

  return (
    <Link
      ref={ref}
      href={pathForPhoto(photo, tag)}
      className={clsx(
        className,
        'active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
        'rounded-[0.15rem] overflow-hidden',
        'border border-gray-200 dark:border-gray-800',
      )}
      prefetch={prefetch}
    >
      <ImageTiny
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
        alt={altTextForPhoto(photo)}
      />
    </Link>
  );
};
