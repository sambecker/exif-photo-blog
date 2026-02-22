'use client';

import { ComponentProps, useMemo, useRef } from 'react';
import {
  getPathComponents,
  PARAM_REDIRECT,
  PATH_ROOT,
  pathForAdminPhotoEdit,
  pathForTag,
} from '@/app/path';
import {
  deletePhotoAction,
  replacePhotoStorageAction,
  syncPhotoAction,
  toggleFavoritePhotoAction,
  togglePrivatePhotoAction,
} from '@/photo/actions';
import {
  Photo,
  deleteConfirmationTextForPhoto,
  downloadFileNameForPhoto,
  titleForPhoto,
} from '@/photo';
import { isPathFavs, isPhotoFav, TAG_PRIVATE } from '@/tag';
import { usePathname } from 'next/navigation';
import MoreMenu, { MoreMenuSection } from '@/components/more/MoreMenu';
import { useAppState } from '@/app/AppState';
import { RevalidatePhoto } from '@/photo/InfinitePhotoScroll';
import { MdOutlineFileDownload } from 'react-icons/md';
import IconGrSync from '@/components/icons/IconGrSync';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';
import IconFavs from '@/components/icons/IconFavs';
import IconEdit from '@/components/icons/IconEdit';
import { photoNeedsToBeUpdated } from '@/photo/update';
import { KEY_COMMANDS } from '@/photo/key-commands';
import { useAppText } from '@/i18n/state/client';
import IconLock from '@/components/icons/IconLock';
import IconTrash from '@/components/icons/IconTrash';
import IconUpload from '@/components/icons/IconUpload';
import { uploadPhotoFromClient } from '@/photo/storage';
import ImageInput from '@/components/ImageInput';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import IconWarning from '@/components/icons/IconWarning';

export default function AdminPhotoMenu({
  photo,
  revalidatePhoto,
  includeFavorite = true,
  showKeyCommands,
  alwaysVisible,
  ...props
}: Omit<ComponentProps<typeof MoreMenu>, 'sections' | 'ariaLabel'> & {
  photo: Photo
  revalidatePhoto?: RevalidatePhoto
  includeFavorite?: boolean
  showKeyCommands?: boolean
  alwaysVisible?: boolean
}) {
  const { isUserSignedIn, registerAdminUpdate } = useAppState();

  const appText = useAppText();

  const inputRef = useRef<HTMLInputElement>(null);
  const onUploadFinishRef = useRef<() => void>(null);

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
    const items: MoreMenuSection['items'] = [{
      label: appText.admin.edit,
      icon: <IconEdit
        size={14}
        className="translate-x-[1px] translate-y-[-0.5px]"
      />,
      href: pathForAdminPhotoEdit(photo.id) +
        `?${PARAM_REDIRECT}=${encodeURIComponent(path)}`,
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
        size={18}
        className="translate-x-[-1.5px]"
      />,
      href: photo.url,
      hrefDownloadName: downloadFileNameForPhoto(photo),
      ...showKeyCommands && { keyCommand: KEY_COMMANDS.download },
    });
    items.push({
      label: appText.admin.sync,
      labelComplex: <span className="inline-flex items-center gap-2">
        <span>{appText.admin.sync}</span>
        {photoNeedsToBeUpdated(photo) &&
          <InsightsIndicatorDot
            colorOverride="blue"
            className="ml-1 translate-y-[1.5px]"
            size="small"
          />}
      </span>,
      icon: <IconGrSync
        className="translate-x-[-1px] translate-y-[0.5px]"
      />,
      items: [{
        label: appText.admin.syncAutomatic,
        icon: <IconGrSync
          className="translate-x-[-1px] translate-y-[0.5px]"
        />,
        action: () => syncPhotoAction(photo.id)
          .then(() => revalidatePhoto?.(photo.id)),
      }, {
        label: appText.admin.syncOverwrite,
        icon: <IconWarning className="translate-x-[-1.5px]" />,
        className: 'text-warning *:hover:text-warning *:active:text-warning',
        color: 'yellow',
        action: () => {
          if(window.confirm(appText.admin.syncOverwriteConfirm)) {
            return syncPhotoAction(photo.id, { syncMode: 'only-missing' })
              .then(() => revalidatePhoto?.(photo.id));
          }
        },
      }],
    });
    items.push({
      label: appText.admin.reupload,
      icon: <IconUpload
        size={16}
        className="translate-x-[-1px] translate-y-px"
      />,
      action: () => new Promise(resolve => {
        onUploadFinishRef.current = resolve;
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.click();
          inputRef.current.oncancel = () => resolve(false);
        } else {
          resolve();
        }
      }),
    });

    return { items };
  }, [
    path,
    appText,
    photo,
    showKeyCommands,
    includeFavorite,
    isFav,
    shouldRedirectFav,
    redirectPathOnPrivateToggle,
    revalidatePhoto,
  ]);

  const sectionDelete: MoreMenuSection = useMemo(() => ({
    items: [{
      label: appText.admin.delete,
      icon: <IconTrash
        className="translate-x-[-1px]"
      />,
      className: 'text-error *:hover:text-error *:active:text-error',
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
    }],
  }), [
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
    isUserSignedIn || alwaysVisible
      ? <>
        <MoreMenu {...{
          ...props,
          sections,
          ariaLabel: `Admin menu for '${titleForPhoto(photo)}' photo`,
        }}/>
        <ImageInput
          ref={inputRef}
          multiple={false}
          onBlobReady={async ({ blob, extension }) =>
            uploadPhotoFromClient(blob, extension)
              .then(updatedStorageUrl =>
                replacePhotoStorageAction(photo.id, updatedStorageUrl))
              .then(() => revalidatePhoto?.(photo.id))
              .finally(onUploadFinishRef.current)}
          shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
        />
      </>
      : null
  );
}
