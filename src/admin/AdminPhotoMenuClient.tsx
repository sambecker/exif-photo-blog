'use client';

import { ComponentProps } from 'react';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/site/paths';
import { deletePhotoAction, toggleFavoritePhotoAction } from '@/photo/actions';
import { FaRegEdit, FaRegStar, FaStar } from 'react-icons/fa';
import { Photo, deleteConfirmationTextForPhoto } from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
import { usePathname } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import MoreMenu from '@/components/MoreMenu';

export default function AdminPhotoMenuClient({
  photo,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'items'> & {
  photo: Photo
}) {
  const isFav = isPhotoFav(photo);
  const path = usePathname();
  const shouldRedirectFav = isPathFavs(path) && isFav;
  const shouldRedirectDelete = pathForPhoto(photo.id) === path;

  return (
    <>
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
                className="text-amber-500 translate-x-[-1.5px]"
              />
              : <FaRegStar
                size={14}
                className="translate-x-[-2px]"
              />,
            action: () => toggleFavoritePhotoAction(
              photo.id,
              shouldRedirectFav,
            ),
          }, {
            label: 'Delete',
            icon: <BiTrash
              size={14}
              className="translate-x-[-1.5px] "
            />,
            action: () => {
              if (confirm(deleteConfirmationTextForPhoto(photo))) {
                return deletePhotoAction(
                  photo.id,
                  photo.url,
                  shouldRedirectDelete,
                );
              }
            },
          },
        ],
        ...props,
      }}/>
    </>
  );
}
