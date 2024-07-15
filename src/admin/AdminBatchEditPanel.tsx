'use client';

import Note from '@/components/Note';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import DeleteButton from './DeleteButton';

export default function AdminBatchEditPanel() {
  const {
    isUserSignedIn,
    selectedPhotoIds,
    setSelectedPhotoIds,
  } = useAppState();

  return isUserSignedIn && selectedPhotoIds !== undefined
    ? <SiteGrid
      className="sticky top-0 z-10 mb-5 -mt-2 pt-2"
      contentMain={<Note
        color="gray"
        className={clsx(
          'backdrop-blur-lg !border-transparent',
          '!text-gray-900 dark:!text-gray-100',
          '!bg-gray-100/90 dark:!bg-gray-900/70'
        )}
        cta={<div className="flex gap-2">
          {selectedPhotoIds.length > 0 &&
            <>
              <LoaderButton>
                Tag ...
              </LoaderButton>
              <DeleteButton />
            </>}
          <LoaderButton
            icon={<IoCloseSharp size={20} className="translate-y-[-1.5px]" />}
            onClick={() => setSelectedPhotoIds?.(undefined)}
          />
        </div>}
        hideIcon
      >
        {selectedPhotoIds.length === 0
          ? 'Select photos below'
          : <>
            {selectedPhotoIds.length}
            {selectedPhotoIds.length === 1 ? ' photo' : ' photos'}
            {' '}
            selected
          </>}
      </Note>} />
    : null;
}
