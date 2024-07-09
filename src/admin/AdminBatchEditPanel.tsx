'use client';

import Note from '@/components/Note';
import LoaderButton from '@/components/primitives/LoaderButton';
import SiteGrid from '@/components/SiteGrid';
import { useAppState } from '@/state/AppState';
import { clsx } from 'clsx/lite';

export default function AdminBatchEditPanel() {
  const {
    isUserSignedIn,
    selectedPhotoIds = [],
    setSelectedPhotoIds,
  } = useAppState();

  return isUserSignedIn && selectedPhotoIds.length > 0
    ? <SiteGrid
      className="mb-5 sticky top-0 z-10 -mt-2 pt-2"
      contentMain={<Note
        color="gray"
        className={clsx(
          'backdrop-blur-lg !border-transparent',
          '!text-gray-900 dark:!text-gray-100',
          '!bg-gray-100/90 dark:!bg-gray-900/80'
        )}
        cta={<LoaderButton
          onClick={() => setSelectedPhotoIds?.([])}
          primary
        >
          Clear
        </LoaderButton>}
      >
        {selectedPhotoIds.length} photos selected
      </Note>} />
    : null;
}
