import { Photo, titleForPhoto } from '.';
import ImageSmall from '@/components/ImageSmall';
import Link from 'next/link';
import { clsx } from 'clsx/lite';
import { pathForPhoto } from '@/site/paths';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';
import AdminPhotoMenu from '@/admin/AdminPhotoMenu';
import { Suspense } from 'react';

export default function PhotoSmall({
  photo,
  tag,
  camera,
  simulation,
  selected,
  showAdminMenu,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  selected?: boolean
  showAdminMenu?: boolean
}) {
  return (
    <Link
      href={pathForPhoto(photo, tag, camera, simulation)}
      className={clsx(
        'relative group',
        'active:brightness-75',
        selected && 'brightness-50',
      )}
    >
      <Suspense>
        {showAdminMenu &&
          <AdminPhotoMenu
            buttonClassName={clsx(
              'absolute top-1 right-1 opacity-0',
              'group-hover:opacity-100 group-focus:opacity-100',
            )}
            photo={photo}
          />}
      </Suspense>
      <ImageSmall
        src={photo.url}
        aspectRatio={photo.aspectRatio}
        blurData={photo.blurData}
        className="w-full"
        alt={titleForPhoto(photo)}
      />
    </Link>
  );
};
