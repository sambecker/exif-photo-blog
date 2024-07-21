'use client';

import Note from '@/components/Note';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useState } from 'react';
import { Tags } from '@/tag';
import { usePathname } from 'next/navigation';
import { PATH_GRID_INFERRED } from '@/site/paths';
import PhotoTagFieldset from './PhotoTagFieldset';
import { tagMultiplePhotosAction } from '@/photo/actions';
import { toastSuccess } from '@/toast';
import DeletePhotosButton from './DeletePhotosButton';
import { photoQuantityText } from '@/photo';

export default function AdminBatchEditPanelClient({
  uniqueTags,
}: {
  uniqueTags: Tags
}) {
  const pathname = usePathname();

  const {
    isUserSignedIn,
    selectedPhotoIds,
    setSelectedPhotoIds,
    isPerformingSelectEdit,
    setIsPerformingSelectEdit,
  } = useAppState();

  const [tags, setTags] = useState<string>();
  const [tagErrorMessage, setTagErrorMessage] = useState('');
  const isInTagMode = tags !== undefined;

  const resetForm = () => {
    setSelectedPhotoIds?.(undefined);
    setTags(undefined);
    setTagErrorMessage('');
  };

  const photosText = photoQuantityText(selectedPhotoIds?.length ?? 0, false);

  const renderPhotoText = () => selectedPhotoIds?.length === 0
    ? 'Select photos below'
    : `${photosText} selected`;

  const renderActions = () => isInTagMode
    ? <>
      <LoaderButton
        className="min-h-[2.5rem]"
        onClick={() => {
          setTags(undefined);
          setTagErrorMessage('');
        }}
        disabled={isPerformingSelectEdit}
      >
        Cancel
      </LoaderButton>
      <LoaderButton
        className="min-h-[2.5rem]"
        // eslint-disable-next-line max-len
        confirmText={`Are you sure you want to apply tags to ${photosText}? This action cannot be undone.`}
        onClick={() => {
          setIsPerformingSelectEdit?.(true);
          tagMultiplePhotosAction(
            tags,
            selectedPhotoIds ?? [],
          )
            .then(() => {
              toastSuccess(
                `Tags applied to ${photosText}`
              );
              resetForm();
            })
            .finally(() => setIsPerformingSelectEdit?.(false));
        }}
        disabled={
          !tags ||
          Boolean(tagErrorMessage) ||
          (selectedPhotoIds?.length ?? 0) === 0 ||
          isPerformingSelectEdit
        }
        primary
      >
        Apply Tags
      </LoaderButton>
    </>
    : <>
      {(selectedPhotoIds?.length ?? 0) > 0 &&
        <>
          <LoaderButton
            onClick={() => setTags('')}
            disabled={isPerformingSelectEdit}
          >
            Tag ...
          </LoaderButton>
          <DeletePhotosButton
            photoIds={selectedPhotoIds}
            disabled={isPerformingSelectEdit}
            onClick={() => setIsPerformingSelectEdit?.(true)}
            onDelete={resetForm}
            onFinish={() => setIsPerformingSelectEdit?.(false)}
          />
        </>}
      <LoaderButton
        icon={<IoCloseSharp size={20} className="translate-y-[0.5px]" />}
        onClick={() => setSelectedPhotoIds?.(undefined)}
      />
    </>;

  return (
    isUserSignedIn &&
    pathname === PATH_GRID_INFERRED &&
    selectedPhotoIds !== undefined
  )
    ? <SiteGrid
      className="sticky top-0 z-10 mb-5 -mt-2 pt-2"
      contentMain={<div className="flex flex-col gap-2">
        <Note
          color="gray"
          className={clsx(
            'min-h-[3.5rem]',
            'backdrop-blur-lg !border-transparent',
            '!text-gray-900 dark:!text-gray-100',
            '!bg-gray-100/90 dark:!bg-gray-900/70',
          )}
          padding={isInTagMode ? 'tight-cta-right-left' : 'tight-cta-right'}
          cta={<div className="flex items-center gap-2.5">
            {renderActions()}
          </div>}
          spaceChildren={false}
          hideIcon
        >
          {isInTagMode
            ? <PhotoTagFieldset
              tags={tags}
              tagOptions={uniqueTags}
              placeholder={`Tag ${photosText} ...`}
              onChange={setTags}
              onError={setTagErrorMessage}
              readOnly={isPerformingSelectEdit}
              openOnLoad
              hideLabel
            />
            : <div className="text-base">
              {renderPhotoText()}
            </div>}
        </Note>
        {tagErrorMessage &&
          <div className="text-error pl-4">
            {tagErrorMessage}
          </div>}
      </div>} />
    : null;
}
