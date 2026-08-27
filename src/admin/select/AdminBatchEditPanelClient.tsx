'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import AppGrid from '@/components/AppGrid';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import { Tags } from '@/tag';
import FieldsetTag from '@/tag/FieldsetTag';
import { batchPhotoAction } from '@/photo/actions';
import { toastSuccess, toastWarning } from '@/toast';
import DeletePhotosButton from '@/admin/DeletePhotosButton';
import { photoQuantityText } from '@/photo';
import { FaArrowDown, FaCheck } from 'react-icons/fa6';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import IconFavs from '@/components/icons/IconFavs';
import IconTag from '@/components/icons/IconTag';
import { useAppText } from '@/i18n/state/client';
import { useAppState } from '@/app/AppState';
import { useSelectPhotosState } from './SelectPhotosState';
import { Albums } from '@/album';
import FieldsetAlbum from '@/album/FieldsetAlbum';
import IconAlbum from '@/components/icons/IconAlbum';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { convertStringToArray } from '@/utility/string';
import {
  getVisibilityLabel,
  getVisibilityOptions,
  VisibilityValue,
} from '@/photo/visibility';
import IconHidden from '@/components/icons/IconHidden';

export default function AdminBatchEditPanelClient({
  uniqueAlbums,
  uniqueTags,
}: {
  uniqueAlbums: Albums
  uniqueTags: Tags
}) {
  const refNote = useRef<HTMLDivElement>(null);

  const {
    canCurrentPageSelectPhotos,
    shouldShowSelectAll,
    isSelectingPhotos,
    stopSelectingPhotos,
    isSelectingAllPhotos,
    toggleIsSelectingAllPhotos,
    selectedPhotoIds,
    selectAllPhotoOptions,
    selectAllCount,
    isPerformingSelectEdit,
    setIsPerformingSelectEdit,
    albumTitles,
    setAlbumTitles,
    tags,
    setTags,
    tagErrorMessage,
    setTagErrorMessage,
    visibility,
    setVisibility,
  } = useSelectPhotosState();

  const appText = useAppText();

  const { invalidateSwr, registerAdminUpdate } = useAppState();

  const isInAlbumMode = albumTitles !== undefined;
  const isInTagMode = tags !== undefined;
  const isInVisibilityMode = visibility !== undefined;
  const isInEditMode = isInAlbumMode || isInTagMode || isInVisibilityMode;

  const visibilityLabel = getVisibilityLabel(appText, visibility);

  const batchPhotoActionArguments = (
    isSelectingAllPhotos &&
    selectAllPhotoOptions
  )
    ? { photoOptions: selectAllPhotoOptions }
    : { photoIds: selectedPhotoIds };

  const photosText = photoQuantityText(
    (isSelectingAllPhotos && selectAllCount !== undefined
      ? selectAllCount
      : selectedPhotoIds?.length) ?? 0,
    appText,
    false,
    false,
  );

  const isFormDisabled =
    isPerformingSelectEdit ||
    (isSelectingAllPhotos
      ? !Boolean(selectAllCount)
      : selectedPhotoIds?.length === 0);

  const hasValidEditValue = isInTagMode
    ? Boolean(tags) && !tagErrorMessage
    : isInAlbumMode
      ? Boolean(albumTitles)
      : Boolean(visibility);

  const performBatchAction = (
    args: Parameters<typeof batchPhotoAction>[0],
    onSuccess: () => void,
  ) => {
    setIsPerformingSelectEdit?.(true);
    batchPhotoAction(args)
      .then(() => {
        onSuccess();
        invalidateSwr?.();
        registerAdminUpdate?.();
        stopSelectingPhotos?.();
      })
      .catch(() =>
        toastWarning(appText.admin.batchActionFailure(photosText)))
      .finally(() => setIsPerformingSelectEdit?.(false));
  };

  const exitEditMode = () => {
    setAlbumTitles?.(undefined);
    setTags?.(undefined);
    setTagErrorMessage?.('');
    setVisibility?.(undefined);
  };

  const renderPhotoSelectionStatus =
    isSelectingAllPhotos && selectAllCount === undefined
      ? <ResponsiveText
        shortText={appText.admin.selectingShort}
        className="text-dim"
      >
        {appText.admin.selecting}
      </ResponsiveText>
      : !isSelectingAllPhotos && selectedPhotoIds?.length === 0
        ? <>
          <FaArrowDown />
          <ResponsiveText>
            {appText.admin.selectPhotosBelow}
          </ResponsiveText>
        </>
        : <ResponsiveText>
          {appText.admin.photosSelected(photosText)}
        </ResponsiveText>;

  const renderEditField = isInAlbumMode
    ? <FieldsetAlbum
      albumOptions={uniqueAlbums}
      value={albumTitles}
      placeholder={appText.admin.albumPlaceholder(photosText)}
      onChange={setAlbumTitles}
      readOnly={isPerformingSelectEdit}
      openOnLoad
      hideLabel
    />
    : isInTagMode
      ? <FieldsetTag
        tags={tags}
        tagOptions={uniqueTags}
        placeholder={appText.admin.tagPlaceholder(photosText)}
        onChange={tags => setTags?.(tags)}
        onError={setTagErrorMessage}
        readOnly={isPerformingSelectEdit}
        openOnLoad
        hideLabel
      />
      : <FieldsetWithStatus
        id="batch-visibility"
        label={appText.admin.setVisibility}
        selectOptions={getVisibilityOptions(appText)}
        selectOptionsDefaultLabel={
          appText.admin.setVisibilityPlaceholder(photosText)
        }
        selectOpenOnLoad
        value={visibility ?? ''}
        onChange={value => setVisibility?.(value as VisibilityValue | '')}
        readOnly={isPerformingSelectEdit}
        hideLabel
      />;

  const renderEditActions = <>
    <LoaderButton
      className="min-h-[2.5rem]"
      icon={<IoCloseSharp
        size={19}
        className="translate-y-[0.5px]"
      />}
      onClick={exitEditMode}
      disabled={isPerformingSelectEdit}
    />
    <LoaderButton
      className="min-h-[2.5rem]"
      icon={<FaCheck size={15} />}
      confirmText={isInTagMode
        ? appText.admin.tagConfirm(photosText)
        : isInAlbumMode
          ? appText.admin.albumConfirm(photosText)
          : appText.admin.setVisibilityConfirm(
            visibilityLabel ?? '',
            photosText,
          )}
      onClick={() => {
        if (isInTagMode) {
          const tagsArray = convertStringToArray(tags, false);
          const tagsFormatted = tagsArray
            .map(tag => `"${tag}"`)
            .join(', ');
          performBatchAction({
            ...batchPhotoActionArguments,
            tags: tagsArray,
          }, () => toastSuccess(
            appText.admin.tagSuccess(photosText, tagsFormatted),
          ));
        } else if (isInAlbumMode) {
          const albumTitlesArray = convertStringToArray(albumTitles, false);
          const albumTitlesFormatted = albumTitlesArray
            .map(title => `"${title}"`)
            .join(', ');
          performBatchAction({
            ...batchPhotoActionArguments,
            albumTitles: albumTitlesArray,
          }, () => toastSuccess(
            appText.admin.albumSuccess(photosText, albumTitlesFormatted),
          ));
        } else if (visibility) {
          performBatchAction({
            ...batchPhotoActionArguments,
            visibility,
          }, () => toastSuccess(
            appText.admin.setVisibilitySuccess(photosText),
          ));
        }
      }}
      disabled={!hasValidEditValue || isFormDisabled}
      primary
    >
      {appText.admin.apply}
    </LoaderButton>
  </>;

  const renderPrimaryActions = <div
    className="flex items-center gap-1 md:gap-2"
  >
    <DeletePhotosButton
      {...{
        ...batchPhotoActionArguments,
        photosText,
      }}
      disabled={isFormDisabled}
      onClick={() => setIsPerformingSelectEdit?.(true)}
      onDelete={stopSelectingPhotos}
      onFinish={() => setIsPerformingSelectEdit?.(false)}
    />
    <LoaderButton
      icon={<IconFavs />}
      disabled={isFormDisabled}
      confirmText={appText.admin.favoriteConfirm(photosText)}
      onClick={() => performBatchAction({
        ...batchPhotoActionArguments,
        action: 'favorite',
      }, () => toastSuccess(appText.admin.favoriteSuccess(photosText)))}
    />
    <LoaderButton
      onClick={() => setAlbumTitles?.('')}
      disabled={isFormDisabled}
      icon={<IconAlbum size={15} className="translate-y-[1.5px]" />}
    >
      {appText.category.album}
    </LoaderButton>
    <LoaderButton
      onClick={() => setTags?.('')}
      disabled={isFormDisabled}
      icon={<IconTag size={15} className="translate-y-[1.5px]" />}
    >
      {appText.category.tag}
    </LoaderButton>
    <LoaderButton
      onClick={() => setVisibility?.('')}
      disabled={isFormDisabled}
      icon={<IconHidden
        size={17}
        className="translate-y-[1px] grow"
        visible
      />}
    >
      {appText.admin.setVisibility}
    </LoaderButton>
  </div>;

  const renderStopSelectingButton = <LoaderButton
    icon={<IoCloseSharp size={19} />}
    onClick={stopSelectingPhotos}
  />;

  const renderSelectAll = shouldShowSelectAll &&
    <FieldsetWithStatus
      id="batch-select-all"
      label={appText.admin.selectAll}
      type="checkbox"
      value={isSelectingAllPhotos ? 'true' : 'false'}
      onChange={toggleIsSelectingAllPhotos}
      readOnly={isSelectingAllPhotos && selectAllCount === undefined}
    />;

  const shouldShowPanel =
    isSelectingPhotos &&
    canCurrentPageSelectPhotos;

  useEffect(() => {
    // Steal focus from Admin Menu to hide tooltip
    if (isSelectingPhotos) {
      refNote.current?.focus();
    }
  }, [isSelectingPhotos]);

  return shouldShowPanel
    ? <AppGrid
      className="sticky top-0 z-10 -mt-2 pt-2"
      contentMain={
        <div
          ref={refNote}
          color="gray"
          className={clsx(
            'flex flex-col gap-2',
            'p-2 rounded-xl',
            'backdrop-blur-lg',
            'text-gray-900! dark:text-gray-100!',
            'bg-gray-100/90! dark:bg-gray-900/70!',
            'outline outline-medium',
            'shadow-xl/5',
          )}
        >
          <div className={clsx(
            'flex gap-1 md:gap-2 min-h-11',
            '[&>*:first-child]:grow [&>*:first-child]:min-w-0',
            // Keep dropdowns above the row below without
            // pushing that row behind the panel
            'relative z-1',
          )}>
            {isInEditMode
              ? <>
                {renderEditField}
                {renderEditActions}
              </>
              : <>
                {renderPrimaryActions}
                {renderStopSelectingButton}
              </>}
          </div>
          <div className="flex items-center gap-2 px-1.5 pb-1">
            <div className="grow flex items-center gap-2 min-w-0">
              {tagErrorMessage
                ? <span className="text-error truncate">
                  {tagErrorMessage}
                </span>
                : renderPhotoSelectionStatus}
            </div>
            {renderSelectAll}
          </div>
        </div>} />
    : null;
}
