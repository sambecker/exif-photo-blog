'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { photoQuantityText } from '@/photo';
import { deletePhotosAction } from '@/photo/actions';
import { toastSuccess, toastWarning } from '@/toast';
import { clsx } from 'clsx/lite';
import { ComponentProps, useState } from 'react';
import { BiTrash } from 'react-icons/bi';

export default function DeletePhotosButton({
  photoIds = [],
  onDelete,
  className,
  ...rest
}: {
  photoIds?: string[]
  onDelete?: () => void
} & ComponentProps<typeof LoaderButton>) {
  const [isLoading, setIsLoading] = useState(false);

  const photosText = photoQuantityText(photoIds.length, false);

  return (
    <LoaderButton
      {...rest}
      title="Delete"
      icon={<BiTrash size={16} />}
      spinnerColor="text"
      className={clsx(
        '!text-red-500 dark:!text-red-600',
        'active:!bg-red-100/50 active:dark:!bg-red-950/50',
        'disabled:!bg-red-100/50 disabled:dark:!bg-red-950/50',
        '!border-red-200 hover:!border-red-300',
        'dark:!border-red-900/75 dark:hover:!border-red-900',
        className,
      )}
      isLoading={isLoading}
      // eslint-disable-next-line max-len
      confirmText={`Are you sure you want to delete ${photosText}? This action cannot be undone.`}
      onClick={() => {
        setIsLoading(true);
        deletePhotosAction(photoIds)
          .then(() => {
            toastSuccess(`${photosText} deleted`);
            onDelete?.();
          })
          .catch(() => toastWarning(`Failed to delete ${photosText}`))
          .finally(() => setIsLoading(false));
      }}
    />
  );
}
