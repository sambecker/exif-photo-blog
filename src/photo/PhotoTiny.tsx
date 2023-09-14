import { Photo, titleForPhoto } from '.';
import ImageTiny from '@/components/ImageTiny';
import Link from 'next/link';
import { cc } from '@/utility/css';
import { pathForPhoto } from '@/site/paths';

export default function PhotoTiny({
  className,
  photo,
  selected,
}: {
  className?: string
  photo: Photo
  selected?: boolean
}) {
  return (
    <Link
      href={pathForPhoto(photo)}
      className={cc(
        className,
        'active:brightness-75',
        selected && 'brightness-50',
        'min-w-[50px]',
      )}
    >
      <ImageTiny
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        alt={titleForPhoto(photo)}
      />
    </Link>
  );
};
