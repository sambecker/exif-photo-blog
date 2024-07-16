'use client';

import Note from '@/components/Note';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import DeleteButton from './DeleteButton';
import { useState } from 'react';
import TagInput from '@/components/TagInput';
import { convertTagsForForm, Tags } from '@/tag';

export default function AdminBatchEditPanelClient({
  existingTags,
}: {
  existingTags: Tags
}) {
  const {
    isUserSignedIn,
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

  const [tags, setTags] = useState<string>();
  const isTagging = tags !== undefined;

  const photosPlural = selectedPhotoIds?.length === 1 ? 'photo' : 'photos';

  const renderPhotoText = () => selectedPhotoIds?.length === 0
    ? 'Select photos below'
    : `${selectedPhotoIds?.length ?? 0} ${photosPlural} selected`;

  const renderActions = () => isTagging
    ? <>
      <LoaderButton
        className="min-h-[2.5rem]"
        onClick={() => setTags(undefined)}
      >
        Cancel
      </LoaderButton>
      <LoaderButton
        className="min-h-[2.5rem]"
        // eslint-disable-next-line max-len
        confirmText={`Are you sure you want to apply tags to ${selectedPhotoIds?.length} ${photosPlural}? This action cannot be undone.`}
        primary
      >
        Apply Tags
      </LoaderButton>
    </>
    : <>
      {(selectedPhotoIds?.length ?? 0) > 0 &&
        <>
          <LoaderButton onClick={() => setTags('')}>
            Tag ...
          </LoaderButton>
          <DeleteButton />
        </>}
      <LoaderButton
        icon={<IoCloseSharp size={20} className="translate-y-[-1.5px]" />}
        onClick={() => setSelectedPhotoIds?.(undefined)}
      />
    </>;

  return isUserSignedIn && selectedPhotoIds !== undefined
    ? <SiteGrid
      className="sticky top-0 z-10 mb-5 -mt-2 pt-2"
      contentMain={<Note
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
          ? <TagInput
            name="tags"
            value={tags}
            options={convertTagsForForm(existingTags)}
            onChange={setTags}
            placeholder={`Tag ${selectedPhotoIds?.length} ${photosPlural} ...`}
          />
          : <div className="text-base">
            {renderPhotoText()}
          </div>}
      </Note>} />
    : null;
}
