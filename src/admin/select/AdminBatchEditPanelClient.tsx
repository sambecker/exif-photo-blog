'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import AppGrid from '@/components/AppGrid';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import { Tags } from '@/tag';
import FieldsetTag from '@/tag/FieldsetTag';
import { batchPhotoAction } from '@/photo/actions';
import { toastSuccess } from '@/toast';
import DeletePhotosButton from '@/admin/DeletePhotosButton';
import { photoQuantityText } from '@/photo';
import { FaArrowDown, FaCheck } from 'react-icons/fa6';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import IconFavs from '@/components/icons/IconFavs';
import IconTag from '@/components/icons/IconTag';
import { useAppText } from '@/i18n/state/client';
import { useSelectPhotosState } from './SelectPhotosState';
import { Albums } from '@/album';
import FieldsetAlbum from '@/album/FieldsetAlbum';
import IconAlbum from '@/components/icons/IconAlbum';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import { convertStringToArray } from '@/utility/string';
import { VISIBILITY_OPTIONS, VisibilityValue } from '@/photo/visibility';
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

  const isInAlbumMode = albumTitles !== undefined;
  const isInTagMode = tags !== undefined;
  const isInVisibilityMode = visibility !== undefined;

  const visibilityLabel = VISIBILITY_OPTIONS
    .find(({ value }) => value === visibility)
    ?.label.toLowerCase();

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
    isSelectingAllPhotos
      ? !Boolean(selectAllCount)
      : selectedPhotoIds?.length === 0;

  const renderPhotoSelectionStatus = isSelectingAllPhotos
    ? selectAllCount === undefined
      ? <ResponsiveText
        shortText={appText.admin.selectingShort}
        className="text-dim"
      >
        {appText.admin.selecting}
      </ResponsiveText>
      : <ResponsiveText
        shortText={appText.admin.allSelectedShort(`${selectAllCount}`)}
      >
        {appText.admin.allSelected(`${selectAllCount}`)}
      </ResponsiveText>
    : selectedPhotoIds?.length === 0
      ? <>
        <FaArrowDown />
        <ResponsiveText shortText={appText.admin.selectPhotosBelowShort}>
          {appText.admin.selectPhotosBelow}
        </ResponsiveText>
      </>
      : <ResponsiveText shortText={photosText}>
        {appText.admin.photosSelected(photosText)}
      </ResponsiveText>;

  const renderActions = isInTagMode || isInAlbumMode || isInVisibilityMode
    ? <>
      <LoaderButton
        className="min-h-[2.5rem]"
        icon={<IoCloseSharp
          size={19}
          className="translate-y-[0.5px]"
        />}
        onClick={() => {
          setAlbumTitles?.(undefined);
          setTags?.(undefined);
          setTagErrorMessage?.('');
          setVisibility?.(undefined);
        }}
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
          setIsPerformingSelectEdit?.(true);
          if (isInTagMode) {
            const tagsArray = convertStringToArray(tags, false);
            const tagsFormatted = tagsArray
              .map(tag => `"${tag}"`)
              .join(', ');
            batchPhotoAction({
              ...batchPhotoActionArguments,
              tags: tagsArray,
            })
              .then(() => {
                toastSuccess(
                  appText.admin.tagSuccess(photosText, tagsFormatted),
                );
                stopSelectingPhotos?.();
              })
              .finally(() => setIsPerformingSelectEdit?.(false));
          } else if (isInAlbumMode) {
            const albumTitlesArray = convertStringToArray(albumTitles, false);
            const albumTitlesFormatted = albumTitlesArray
              .map(title => `"${title}"`)
              .join(', ');
            batchPhotoAction({
              ...batchPhotoActionArguments,
              albumTitles: albumTitlesArray,
            })
              .then(() => {
                toastSuccess(
                  appText.admin.albumSuccess(
                    photosText,
                    albumTitlesFormatted,
                  ),
                );
                stopSelectingPhotos?.();
              })
              .finally(() => setIsPerformingSelectEdit?.(false));
          } else if (isInVisibilityMode && visibility) {
            batchPhotoAction({
              ...batchPhotoActionArguments,
              visibility,
            })
              .then(() => {
                toastSuccess(appText.admin.setVisibilitySuccess(photosText));
                stopSelectingPhotos?.();
              })
              .finally(() => setIsPerformingSelectEdit?.(false));
          }
        }}
        disabled={
          (
            (!tags || Boolean(tagErrorMessage)) &&
            !albumTitles &&
            !visibility
          ) ||
          isFormDisabled
        }
        primary
      >
        {appText.admin.apply}
      </LoaderButton>
    </>
    : <>
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
        onClick={() => {
          setIsPerformingSelectEdit?.(true);
          batchPhotoAction({
            ...batchPhotoActionArguments,
            action: 'favorite',
          })
            .then(() => {
              toastSuccess(appText.admin.favoriteSuccess(photosText));
              stopSelectingPhotos?.();
            })
            .finally(() => setIsPerformingSelectEdit?.(false));
        }}
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
        icon={<IconHidden size={15} className="translate-y-[1.5px]" />}
      >
        {appText.admin.setVisibility}
      </LoaderButton>
      <LoaderButton
        icon={<IoCloseSharp size={19} />}
        onClick={stopSelectingPhotos}
      />
    </>;

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
            'flex items-center gap-1 md:gap-2',
            '[&>*:first-child]:grow',
          )}>
            {isInAlbumMode
              ? <FieldsetAlbum
                albumOptions={uniqueAlbums}
                value={albumTitles}
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
                : isInVisibilityMode
                  ? <FieldsetWithStatus
                    label={appText.admin.setVisibility}
                    selectOptions={VISIBILITY_OPTIONS}
                    selectOptionsDefaultLabel={
                      appText.admin.setVisibilityPlaceholder(photosText)
                    }
                    value={visibility ?? ''}
                    onChange={value =>
                      setVisibility?.(value as VisibilityValue)}
                    readOnly={isPerformingSelectEdit}
                    hideLabel
                  />
                  : <div className="grow">
                    <div className="flex items-center gap-2">
                      {renderPhotoSelectionStatus}
                    </div>
                  </div>}
            {renderActions}
          </div>
          {shouldShowSelectAll &&
            <FieldsetWithStatus
              label={appText.admin.selectAll}
              type="checkbox"
              className="-z-10"
              value={isSelectingAllPhotos ? 'true' : 'false'}
              onChange={toggleIsSelectingAllPhotos}
              readOnly={isSelectingAllPhotos &&
                selectAllCount === undefined}
            />}
          {tagErrorMessage &&
            <div className="text-error pl-4">
              {tagErrorMessage}
            </div>}
        </div>} />
    : null;
}
