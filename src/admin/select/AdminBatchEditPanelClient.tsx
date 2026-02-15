'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import AppGrid from '@/components/AppGrid';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { Tags } from '@/tag';
import FieldsetTag from '@/tag/FieldsetTag';
import { batchPhotoAction, getPhotoCountForPathAction } from '@/photo/actions';
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
import { usePathname } from 'next/navigation';

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
    isSelectingPhotos,
    stopSelectingPhotos,
    isSelectingAllPhotos,
    toggleIsSelectingAllPhotos,
    selectedPhotoIds,
    isPerformingSelectEdit,
    setIsPerformingSelectEdit,
  } = useSelectPhotosState();

  const showSelectAll = true;

  const pathname = usePathname();
  const [queryCountPreview, setQueryCountPreview] = useState<number>();

  const appText = useAppText();

  const [albumTitles, setAlbumsTitles] = useState<string>();
  const isInAlbumMode = albumTitles !== undefined;

  const [tags, setTags] = useState<string>();
  const [tagErrorMessage, setTagErrorMessage] = useState('');
  const isInTagMode = tags !== undefined;

  const photosText = photoQuantityText(
    selectedPhotoIds?.length ?? 0,
    appText,
    false,
    false,
  );

  const isFormDisabled =
    isPerformingSelectEdit ||
    selectedPhotoIds?.length === 0;

  const renderPhotoSelectionStatus = isSelectingAllPhotos
    ? queryCountPreview === undefined
      ? 'Querying ...'
      : <ResponsiveText shortText={`${queryCountPreview} selected`}>
        {`${queryCountPreview} photos selected`}
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
          setAlbumsTitles(undefined);
          setTags(undefined);
          setTagErrorMessage('');
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
            batchPhotoAction({
              photoIds: selectedPhotoIds,
              tags: convertStringToArray(tags, false),
            })
              .then(() => {
                toastSuccess(`${photosText} tagged`);
                stopSelectingPhotos?.();
              })
              .finally(() => setIsPerformingSelectEdit?.(false));
          } else if (isInAlbumMode) {
            batchPhotoAction({
              photoIds: selectedPhotoIds,
              albumTitles: albumTitles.split(','),
            })
              .then(() => {
                toastSuccess(`${photosText} added`);
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
          (selectedPhotoIds?.length ?? 0) === 0 ||
          isPerformingSelectEdit
        }
        primary
      >
        Apply
      </LoaderButton>
    </>
    : <>
      <DeletePhotosButton
        photoIds={selectedPhotoIds}
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
            photoIds: selectedPhotoIds,
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
        onClick={() => setAlbumsTitles('')}
        disabled={isFormDisabled}
        icon={<IconAlbum size={15} className="translate-y-[1.5px]" />}
      >
        Album
      </LoaderButton>
      <LoaderButton
        onClick={() => setTags('')}
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
    if (!shouldShowPanel) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQueryCountPreview(undefined);
    }
  }, [shouldShowPanel]);

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
            'p-2 rounded-[10px]',
            'backdrop-blur-lg',
            'text-gray-900! dark:text-gray-100!',
            'bg-gray-100/90! dark:bg-gray-900/70!',
            'outline outline-medium',
            'shadow-xl/5',
          )}
        >
          <div className="flex items-center gap-2">
            {isInAlbumMode
              ? <FieldsetAlbum
                albumOptions={uniqueAlbums}
                value={albumTitles}
                onChange={setAlbumsTitles}
                readOnly={isPerformingSelectEdit}
                openOnLoad
                hideLabel
              />
              : isInTagMode
                ? <FieldsetTag
                  tags={tags}
                  tagOptions={uniqueTags}
                  placeholder={`Tag ${photosText} ...`}
                  onChange={setTags}
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
          <div className="flex items-center gap-1">
            {showSelectAll &&
              <FieldsetWithStatus
                label="Select All"
                type="checkbox"
                value={isSelectingAllPhotos ? 'true' : 'false'}
                onChange={value => {
                  toggleIsSelectingAllPhotos?.();
                  if (value === 'true') {
                    getPhotoCountForPathAction(pathname)
                      .then(setQueryCountPreview)
                      .catch(toggleIsSelectingAllPhotos);
                  }
                }}
                readOnly={isSelectingAllPhotos &&
                  queryCountPreview === undefined}
              />}
            {tagErrorMessage &&
              <div className="text-error pl-4">
                {tagErrorMessage}
              </div>}
          </div>
        </div>} />
    : null;
}
