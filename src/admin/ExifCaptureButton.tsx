'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { getExifDataAction } from '@/photo/actions';
import { PhotoFormData } from '@/photo/form';
import { clsx } from 'clsx/lite';
import { ComponentProps, useState } from 'react';
import { LuDatabaseBackup } from 'react-icons/lu';

export default function ExifCaptureButton({
  photoUrl,
  onSync,
}: {
  photoUrl: string
  onSync?: (data: Partial<PhotoFormData>) => void
} & ComponentProps<typeof SubmitButtonWithStatus>) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderButton
      title="Update photo from original file"
      isLoading={isLoading}
      onClick={() => {
        setIsLoading(true);
        getExifDataAction(photoUrl)
          .then(onSync)
          .finally(() => setIsLoading(false));
      }}
      icon={<LuDatabaseBackup
        size={16}
        className={clsx(
          'translate-y-[0.5px] translate-x-[0.5px]',
          'sm:translate-x-[-0.5px]',
        )} />}
    >
      EXIF
    </LoaderButton>
  );
}
