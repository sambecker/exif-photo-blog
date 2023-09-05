import { Photo } from '.';
import ImageTiny from '@/components/ImageTiny';
import Link from 'next/link';
import { cc } from '@/utility/css';
import { routeForPhoto } from '@/site/routes';

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
      href={routeForPhoto(photo)}
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
        alt={photo.title ?? 'Photo'}
      />
    </Link>
  );
};
