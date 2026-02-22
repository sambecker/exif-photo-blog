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
  } = useSelectPhotosState();

  const appText = useAppText();

  const isInAlbumMode = albumTitles !== undefined;
  const isInTagMode = tags !== undefined;

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
      ? <ResponsiveText shortText="Selecting" className="text-dim">
        Selecting ...
      </ResponsiveText>
      : <ResponsiveText shortText={`${selectAllCount} photos`}>
        {`${selectAllCount} photos selected`}
      </ResponsiveText>
    : selectedPhotoIds?.length === 0
      ? <>
        <FaArrowDown />
        <ResponsiveText shortText="Select">
          Select photos below
        </ResponsiveText>
      </>
      : <ResponsiveText shortText={photosText}>
        {photosText} selected
      </ResponsiveText>;

  const renderActions = isInTagMode || isInAlbumMode
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
        }}
        disabled={isPerformingSelectEdit}
      />
      <LoaderButton
        className="min-h-[2.5rem]"
        icon={<FaCheck size={15} />}
        confirmText={isInTagMode
          // eslint-disable-next-line max-len
          ? `Are you sure you want to apply tags to ${photosText}? This action cannot be undone.`
          // eslint-disable-next-line max-len
          : `Are you sure you want to add ${photosText} to these albums? This action cannot be undone.`}
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
                toastSuccess(`${photosText} tagged ${tagsFormatted}`);
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
                  `${photosText} added to ${albumTitlesFormatted}`,
                );
                stopSelectingPhotos?.();
              })
              .finally(() => setIsPerformingSelectEdit?.(false));
          }
        }}
        disabled={
          (
            (!tags || Boolean(tagErrorMessage)) &&
            !albumTitles
          ) ||
          isFormDisabled
        }
        primary
      >
        Apply
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
        confirmText={`Are you sure you want to favorite ${photosText}?`}
        onClick={() => {
          setIsPerformingSelectEdit?.(true);
          batchPhotoAction({
            ...batchPhotoActionArguments,
            action: 'favorite',
          })
            .then(() => {
              toastSuccess(`${photosText} favorited`);
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
        Album
      </LoaderButton>
      <LoaderButton
        onClick={() => setTags?.('')}
        disabled={isFormDisabled}
        icon={<IconTag size={15} className="translate-y-[1.5px]" />}
      >
        Tag
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
                  placeholder={`Tag ${photosText} ...`}
                  onChange={tags => setTags?.(tags)}
                  onError={setTagErrorMessage}
                  readOnly={isPerformingSelectEdit}
                  openOnLoad
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
              label="Select All"
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
