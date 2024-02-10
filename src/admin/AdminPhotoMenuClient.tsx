'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit } from '@/site/paths';
import MoreMenu from '../components/MoreMenu';
import { toggleFavoritePhoto } from '@/photo/actions';
import { FaRegEdit, FaStar } from 'react-icons/fa';
import { Photo } from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
import clsx from 'clsx/lite';
import { usePathname } from 'next/navigation';

export default function AdminPhotoMenuClient({
  photo,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'items'> & {
  photo: Photo
}) {
  const isFav = isPhotoFav(photo);
  const path = usePathname();
  const shouldRedirect = isPathFavs(path) && isFav;
  return (
    <MoreMenu {...{
      items: [
        {
          label: 'Edit Photo',
          icon: <FaRegEdit size={14} className="translate-y-[-0.5px]" />,
          href: pathForAdminPhotoEdit(photo.id),
        }, {
          label: isFav ? 'Unfavorite' : 'Favorite',
          icon: <FaStar stroke='text-amber-500' className={clsx(
            'translate-x-[-1px]',
            isFav && 'text-amber-500',
          )} />,
          action: () => toggleFavoritePhoto(photo.id, shouldRedirect),
        },
      ],
      ...props,
    }}/>
  );
}
