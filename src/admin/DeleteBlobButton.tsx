'use client';

import { deleteUploadAction } from '@/photo/actions';
import DeleteButton from './DeleteButton';
import { useRouter } from 'next/navigation';
import { PATH_ADMIN_PHOTOS } from '@/app/paths';
import { useState } from 'react';

export default function DeleteUploadButton({
  url,
  shouldRedirectToAdminPhotos,
  onDelete,
}: {
  url: string
  shouldRedirectToAdminPhotos?: boolean
  onDelete?: () => void
}) {
  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <DeleteButton
      confirmText="Are you sure you want to delete this upload?"
      onClick={() => {
        setIsDeleting(true);
        deleteUploadAction(url)
          .then(() => {
            onDelete?.();
            if (shouldRedirectToAdminPhotos) {
              router.push(PATH_ADMIN_PHOTOS);
            } else {
              setIsDeleting(false);
            }
          })
          .catch(() => setIsDeleting(false));
      }}
      isLoading={isDeleting}
    />
  );
}
