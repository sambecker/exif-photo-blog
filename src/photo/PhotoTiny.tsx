import { Photo, altTextForPhoto } from '.';
import ImageTiny from '@/components/ImageTiny';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';

export default function PhotoTiny({
  photo,
  tag,
  selected,
  className,
}: {
  photo: Photo
  tag?: string
  selected?: boolean
  className?: string
}) {
  return (
    <Link
      href={pathForPhoto(photo, tag)}
      className={clsx(
        className,
        'active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
        'rounded-[0.15rem] overflow-hidden',
        'border border-gray-200 dark:border-gray-800',
      )}
    >
      <ImageTiny
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        alt={altTextForPhoto(photo)}
      />
    </Link>
  );
};
