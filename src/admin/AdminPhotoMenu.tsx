'use client';

import { ComponentProps, useMemo } from 'react';
import {
  getPathComponents,
  PATH_ROOT,
  pathForAdminPhotoEdit,
  pathForTag,
} from '@/app/paths';
import {
  deletePhotoAction,
  syncPhotoAction,
  toggleFavoritePhotoAction,
  togglePrivatePhotoAction,
} from '@/photo/actions';
import {
  Photo,
  deleteConfirmationTextForPhoto,
  downloadFileNameForPhoto,
} from '@/photo';
import { isPathFavs, isPhotoFav, TAG_PRIVATE } from '@/tag';
import { usePathname } from 'next/navigation';
import { BiTrash } from 'react-icons/bi';
import MoreMenu from '@/components/more/MoreMenu';
import { useAppState } from '@/app/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import { MdOutlineFileDownload } from 'react-icons/md';
import MoreMenuItem from '@/components/more/MoreMenuItem';
import IconGrSync from '@/components/icons/IconGrSync';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';
import IconFavs from '@/components/icons/IconFavs';
import IconEdit from '@/components/icons/IconEdit';
import { photoNeedsToBeSynced } from '@/photo/sync';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { useAppText } from '@/i18n/state/client';
import IconLock from '@/components/icons/IconLock';

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

  const appText = useAppText();

  const path = usePathname();
  const pathComponents = getPathComponents(path);
  const isOnPhotoDetail = pathComponents.photoId === photo.id;
  const isFav = isPhotoFav(photo);
  const shouldRedirectFav = isPathFavs(path) && isFav;
  const shouldRedirectDelete = isOnPhotoDetail;
  const redirectPathOnPrivateToggle = isOnPhotoDetail
    ? photo.hidden
      ? pathForTag(TAG_PRIVATE)
      : PATH_ROOT
    : undefined;


  const sectionMain = useMemo(() => {
    const items: ComponentProps<typeof MoreMenuItem>[] = [{
      label: appText.admin.edit,
      icon: <IconEdit
        size={14}
        className="translate-x-[0.5px] translate-y-[0.5px]"
      />,
      href: pathForAdminPhotoEdit(photo.id),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.edit },
    }];
    if (includeFavorite) {
      items.push({
        label: isFav ? appText.admin.unfavorite : appText.admin.favorite,
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
    items.push({
      label: photo.hidden ? appText.admin.public : appText.admin.private,
      icon: <IconLock
        size={16}
        className="translate-x-[-1.5px] translate-y-[0.5px]"
        open={!photo.hidden}
        narrow
      />,
      action: () => togglePrivatePhotoAction(
        photo.id,
        redirectPathOnPrivateToggle,
      )
        .then(() => revalidatePhoto?.(photo.id)),
      ...showKeyCommands && {
        keyCommand: KEY_COMMANDS.togglePrivate,
      },
    });
    items.push({
      label: appText.admin.download,
      icon: <MdOutlineFileDownload
        size={17}
        className="translate-x-[-1px]"
      />,
      href: photo.url,
      hrefDownloadName: downloadFileNameForPhoto(photo),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.download },
    });
    items.push({
      label: appText.admin.sync,
      labelComplex: <span className="inline-flex items-center gap-2">
        <span>{appText.admin.sync}</span>
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

    return items;
  }, [
    appText,
    photo,
    showKeyCommands,
    includeFavorite,
    isFav,
    shouldRedirectFav,
    redirectPathOnPrivateToggle,
    revalidatePhoto,
  ]);

  const sectionDelete: ComponentProps<typeof MoreMenuItem>[] = useMemo(() => [{
    label: appText.admin.delete,
    icon: <BiTrash
      size={15}
      className="translate-x-[-1px]"
    />,
    className: 'text-error *:hover:text-error',
    color: 'red',
    action: () => {
      if (confirm(deleteConfirmationTextForPhoto(photo, appText))) {
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
  }], [
    appText,
    photo,
    showKeyCommands,
    revalidatePhoto,
    shouldRedirectDelete,
    registerAdminUpdate,
  ]);

  const sections = useMemo(() =>
    [sectionMain, sectionDelete]
  , [sectionMain, sectionDelete]);

  return (
    isUserSignedIn
      ? <MoreMenu {...{
        ...props,
        sections,
      }}/>
      : null
  );
}
