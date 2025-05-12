'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { photoQuantityText } from '@/photo';
import { deletePhotosAction } from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { toastSuccess, toastWarning } from '@/toast';
import { ComponentProps, useState } from 'react';
import DeleteButton from './DeleteButton';
import { useAppText } from '@/i18n/state/client';

export default function DeletePhotosButton({
  photoIds = [],
  onDelete,
  clearLocalState = true,
  onClick,
  onFinish,
  confirmText,
  toastText,
  ...rest
}: {
  photoIds?: string[]
  onClick?: () => void
  onFinish?: () => void
  onDelete?: () => void
  clearLocalState?: boolean
  toastText?: string
} & ComponentProps<typeof LoaderButton>) {
  const [isLoading, setIsLoading] = useState(false);

  const appText = useAppText();

  const photosText = photoQuantityText(photoIds.length, appText, false, false);

  const { invalidateSwr, registerAdminUpdate } = useAppState();

  return (
    <DeleteButton
      {...rest}
      isLoading={isLoading}
      // eslint-disable-next-line max-len
      confirmText={confirmText ?? `Are you sure you want to delete ${photosText}? This action cannot be undone.`}
      onClick={() => {
        onClick?.();
        setIsLoading(true);
        deletePhotosAction(photoIds)
          .then(() => {
            toastSuccess(toastText ?? `${photosText} deleted`);
            if (clearLocalState) {
              invalidateSwr?.();
              registerAdminUpdate?.();
            }
            onDelete?.();
          })
          .catch(() => toastWarning(`Failed to delete ${photosText}`))
          .finally(() => {
            setIsLoading(false);
            onFinish?.();
          });
      }}
    />
  );
}
