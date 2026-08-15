'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import AppGrid from '@/components/AppGrid';
import { clsx } from 'clsx/lite';
import { IoCloseSharp } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import { batchUpdatePhotoTitlesAction } from '@/photo/actions';
import { toastSuccess } from '@/toast';
import { photoQuantityText } from '@/photo';
import { FaArrowDown, FaCheck } from 'react-icons/fa6';
import ResponsiveText from '@/components/primitives/ResponsiveText';
import { useAppText } from '@/i18n/state/client';
import { useEditTitlesState } from './EditTitlesState';
import { useAppState } from '@/app/AppState';

export default function AdminEditTitlesPanel() {
  const refNote = useRef<HTMLDivElement>(null);

  const {
    isEditingTitles,
    stopEditingTitles,
    photoEdits,
    modifiedPhotoCount = 0,
    isPerformingUpdate,
    setIsPerformingUpdate,
    clearPhotoEdits,
  } = useEditTitlesState();

  const { invalidateSwr, registerAdminUpdate } = useAppState();

  const appText = useAppText();

  const photosText = photoQuantityText(
    modifiedPhotoCount,
    appText,
    false,
    false,
  );

  const isFormDisabled =
    isPerformingUpdate ||
    modifiedPhotoCount === 0;

  useEffect(() => {
    // Steal focus from Admin Menu to hide tooltip
    if (isEditingTitles) {
      refNote.current?.focus();
    }
  }, [isEditingTitles]);

  return isEditingTitles
    ? <AppGrid
      className="sticky top-0 z-10 -mt-2 pt-2"
      contentMain={
        <div
          ref={refNote}
          tabIndex={-1}
          className={clsx(
            'flex items-center gap-1 md:gap-2',
            'p-2 rounded-xl',
            'backdrop-blur-lg',
            'text-gray-900! dark:text-gray-100!',
            'bg-gray-100/90! dark:bg-gray-900/70!',
            'outline outline-medium',
            'shadow-xl/5',
            '[&>*:first-child]:grow',
          )}
        >
          <div className="flex items-center gap-2">
            {modifiedPhotoCount === 0
              ? <>
                <FaArrowDown />
                <ResponsiveText shortText="Edit titles">
                  Edit titles and captions below
                </ResponsiveText>
              </>
              : <ResponsiveText shortText={photosText}>
                {photosText} modified
              </ResponsiveText>}
          </div>
          <LoaderButton
            className="min-h-[2.5rem]"
            icon={<FaCheck size={15} />}
            // eslint-disable-next-line max-len
            confirmText={`Are you sure you want to update titles for ${photosText}? This action cannot be undone.`}
            disabled={isFormDisabled}
            onClick={() => {
              if (!photoEdits) { return; }
              setIsPerformingUpdate?.(true);
              const updates = Object.entries(photoEdits).map(([
                photoId,
                { title, caption },
              ]) => ({
                photoId,
                title,
                caption,
              }));
              batchUpdatePhotoTitlesAction(updates)
                .then(() => {
                  toastSuccess(`Updated ${photosText}`);
                  invalidateSwr?.();
                  registerAdminUpdate?.();
                  clearPhotoEdits?.();
                  stopEditingTitles?.();
                })
                .finally(() => setIsPerformingUpdate?.(false));
            }}
            primary
          >
            <ResponsiveText shortText={`Update ${modifiedPhotoCount}`}>
              {`Update ${photosText}`}
            </ResponsiveText>
          </LoaderButton>
          <LoaderButton
            className="min-h-[2.5rem]"
            icon={<IoCloseSharp size={19} />}
            onClick={stopEditingTitles}
            disabled={isPerformingUpdate}
          />
        </div>}
    />
    : null;
}
