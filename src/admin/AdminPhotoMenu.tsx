'use client';

import { ComponentProps, useMemo } from 'react';
import { pathForAdminPhotoEdit, pathForPhoto } from '@/app/paths';
import {
  deletePhotoAction,
  syncPhotoAction,
  toggleFavoritePhotoAction,
} from '@/photo/actions';
import {
  Photo,
  deleteConfirmationTextForPhoto,
  downloadFileNameForPhoto,
} from '@/photo';
import { isPathFavs, isPhotoFav } from '@/tag';
import { usePathname } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import MoreMenu from '@/components/more/MoreMenu';
import { useAppState } from '@/state/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import { MdOutlineFileDownload } from 'react-icons/md';
import MoreMenuItem from '@/components/more/MoreMenuItem';
import IconGrSync from '@/components/icons/IconGrSync';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';
import IconFavs from '@/components/icons/IconFavs';
import IconEdit from '@/components/icons/IconEdit';
import { photoNeedsToBeSynced } from '@/photo/sync';
import { KEY_COMMANDS } from '@/photo/key-commands';

export default function AdminPhotoMenu({
  photo,
  revalidatePhoto,
  includeFavorite = true,
  showKeyCommands,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'sections'> & {
  photo: Photo
  revalidatePhoto?: RevalidatePhoto
  includeFavorite?: boolean
  showKeyCommands?: boolean
}) {
  const { isUserSignedIn, registerAdminUpdate } = useAppState();

  const isFav = isPhotoFav(photo);
  const path = usePathname();
  const shouldRedirectFav = isPathFavs(path) && isFav;
  const shouldRedirectDelete = pathForPhoto({ photo: photo.id }) === path;

  const sections = useMemo(() => {
    const sectionMain: ComponentProps<typeof MoreMenuItem>[] = [{
      label: 'Edit',
      icon: <IconEdit
        size={15}
        className="translate-x-[0.5px]"
      />,
      href: pathForAdminPhotoEdit(photo.id),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.edit },
    }];
    if (includeFavorite) {
      sectionMain.push({
        label: isFav ? 'Unfavorite' : 'Favorite',
        icon: <IconFavs
          size={14}
          className="translate-x-[-1px] translate-y-[0.5px]"
          highlight={isFav}
        />,
        action: () => toggleFavoritePhotoAction(
          photo.id,
          shouldRedirectFav,
        ).then(() => revalidatePhoto?.(photo.id)),
        ...showKeyCommands && {
          keyCommand: isFav
            ? KEY_COMMANDS.unfavorite
            : KEY_COMMANDS.favorite,
        },
      });
    }
    sectionMain.push({
      label: 'Download',
      icon: <MdOutlineFileDownload
        size={17}
        className="translate-x-[-1px]"
      />,
      href: photo.url,
      hrefDownloadName: downloadFileNameForPhoto(photo),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.download },
    });
    sectionMain.push({
      label: 'Sync',
      labelComplex: <span className="inline-flex items-center gap-2">
        <span>Sync</span>
        {photoNeedsToBeSynced(photo) &&
          <InsightsIndicatorDot
            colorOverride="blue"
            className="ml-1 translate-y-[1.5px]"
            size="small"
          />}
      </span>,
      icon: <IconGrSync
        className="translate-x-[-1px] translate-y-[0.5px]"
      />,
      action: () => syncPhotoAction(photo.id)
        .then(() => revalidatePhoto?.(photo.id)),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.sync },
    });
    const sectionDelete: ComponentProps<typeof MoreMenuItem>[] = [{
      label: 'Delete',
      icon: <BiTrash
        size={15}
        className="translate-x-[-1px]"
      />,
      className: 'text-error *:hover:text-error',
      color: 'red',
      action: () => {
        if (confirm(deleteConfirmationTextForPhoto(photo))) {
          return deletePhotoAction(
            photo.id,
            photo.url,
            shouldRedirectDelete,
          ).then(() => {
            revalidatePhoto?.(photo.id, true);
            registerAdminUpdate?.();
          });
        }
      },
      ...showKeyCommands && {
        keyCommandModifier: KEY_COMMANDS.delete[0],
        keyCommand: KEY_COMMANDS.delete[1],
      },
    }];
    return [sectionMain, sectionDelete];
  }, [
    photo,
    showKeyCommands,
    includeFavorite,
    isFav,
    shouldRedirectFav,
    revalidatePhoto,
    shouldRedirectDelete,
    registerAdminUpdate,
  ]);

  return (
    isUserSignedIn
      ? <MoreMenu {...{
        sections,
        ...props,
      }}/>
      : null
  );
}
