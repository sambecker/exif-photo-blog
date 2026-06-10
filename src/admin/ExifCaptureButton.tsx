'use client';



import LoaderButton from '@/components/primitives/LoaderButton';
import { getExifDataAction } from '@/photo/actions';
import { PhotoFormData } from '@/photo/form';
import { useState } from 'react';
import { useAppText } from '@/i18n/state/client';
import LuDatabaseBackupIcon from '@/components/icons/LuDatabaseBackupIcon';

export default function ExifCaptureButton({

  photoUrl,
  onExifDataCapture,
}: {

  photoUrl: string,
  onExifDataCapture: (formData: Partial<PhotoFormData>) => void,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const appText = useAppText();

  return (
    <LoaderButton
      isLoading={isLoading}
      onClick={() => {
        setIsLoading(true);
        getExifDataAction(photoUrl)
          .then(onExifDataCapture)
          .finally(() => setIsLoading(false));
      }}
      icon={<LuDatabaseBackupIcon
        size={16}
        className={
          'translate-y-[0.5px] translate-x-[0.5px]'
        }
      />}
    >
      {appText.admin.getExif}
    </LoaderButton>
  );
}
