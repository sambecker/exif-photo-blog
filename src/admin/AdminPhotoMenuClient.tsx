'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit } from '@/site/paths';
import MoreMenu from '../components/MoreMenu';
import { toggleFavoritePhoto } from '@/photo/actions';
import { FaRegEdit, FaRegStar, FaStar } from 'react-icons/fa';
import { Photo } from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
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
          label: 'Edit',
          icon: <FaRegEdit size={14} />,
          href: pathForAdminPhotoEdit(photo.id),
        }, {
          label: isFav ? 'Unfavorite' : 'Favorite',
          icon: isFav
            ? <FaStar
              size={14}
              className="text-amber-500"
            />
            : <FaRegStar
              size={14}
              className="translate-x-[-1px]"
            />,
          action: () => toggleFavoritePhoto(photo.id, shouldRedirect),
        },
      ],
      ...props,
    }}/>
  );
}
