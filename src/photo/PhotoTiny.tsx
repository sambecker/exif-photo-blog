import { Photo, titleForPhoto } from '.';
import ImageTiny from '@/components/ImageTiny';
import Link from 'next/link';
import { cc } from '@/utility/css';
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
