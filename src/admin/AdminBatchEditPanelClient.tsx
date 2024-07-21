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
  } = useAppState();

  const [isLoading, setIsLoading] = useState(false);

  const [tags, setTags] = useState<string>();
  const [tagErrorMessage, setTagErrorMessage] = useState('');
  const isTagging = tags !== undefined;

  const resetForm = () => {
    setSelectedPhotoIds?.(undefined);
    setTags(undefined);
    setTagErrorMessage('');
  };

  const photosPlural = selectedPhotoIds?.length === 1 ? 'photo' : 'photos';

  const renderPhotoText = () => selectedPhotoIds?.length === 0
    ? 'Select photos below'
    : `${selectedPhotoIds?.length ?? 0} ${photosPlural} selected`;

  const renderActions = () => isTagging
    ? <>
      <LoaderButton
        className="min-h-[2.5rem]"
        onClick={() => {
          setTags(undefined);
          setTagErrorMessage('');
        }}
        disabled={isLoading}
      >
        Cancel
      </LoaderButton>
      <LoaderButton
        className="min-h-[2.5rem]"
        // eslint-disable-next-line max-len
        confirmText={`Are you sure you want to apply tags to ${selectedPhotoIds?.length} ${photosPlural}? This action cannot be undone.`}
        onClick={() => {
          setIsLoading(true);
          tagMultiplePhotosAction(
            tags,
            selectedPhotoIds ?? [],
          )
            .then(() => {
              toastSuccess(
                `Tags applied to ${selectedPhotoIds?.length} ${photosPlural}`
              );
              resetForm();
            })
            .finally(() => setIsLoading(false));
        }}
        disabled={
          !tags ||
          Boolean(tagErrorMessage) ||
          (selectedPhotoIds?.length ?? 0) === 0 ||
          isLoading
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
            isLoading={isLoading}
          >
            Tag ...
          </LoaderButton>
          <DeletePhotosButton
            photoIds={selectedPhotoIds}
            disabled={isLoading}
            onDelete={resetForm}
          />
        </>}
      <LoaderButton
        icon={<IoCloseSharp size={20} className="translate-y-[-1.5px]" />}
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
          padding={isTagging ? 'tight-cta-right-left' : 'tight-cta-right'}
          cta={<div className="flex items-center gap-2.5">
            {renderActions()}
          </div>}
          spaceChildren={false}
          hideIcon
        >
          {isTagging
            ? <PhotoTagFieldset
              tags={tags}
              tagOptions={uniqueTags}
              placeholder={
                `Tag ${selectedPhotoIds?.length} ${photosPlural} ...`
              }
              onChange={setTags}
              onError={setTagErrorMessage}
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
