import LoaderButton from '@/components/primitives/LoaderButton';
import { addUploadAction } from '@/photo/actions';
import {
  generateLocalNaivePostgresString,
  generateLocalPostgresString,
} from '@/utility/date';
import { pathForAdminUploadUrl } from '@/app/path';
import { useRouter } from 'next/navigation';
import { ComponentProps, useState } from 'react';
import IconAddUpload from '@/components/icons/IconAddUpload';

export default function AddUploadButton({
  url,
  title,
  onAddStart,
  onAddFinish,
  shouldRedirectToAdminPhotos,
  ...props
}: {
  url: string
  title?: string
  onAddStart?: () => void
  onAddFinish?: (success: boolean) => void
  shouldRedirectToAdminPhotos: boolean
} & ComponentProps<typeof LoaderButton>) {
  const router = useRouter();

  const [isAddingLocal, setIsAddingLocal] = useState(false);

  return (
    <LoaderButton
      {...props}
      icon={<IconAddUpload />}
      onClick={() => {
        onAddStart?.();
        setIsAddingLocal(true);
        addUploadAction({
          url,
          title,
          takenAtLocal: generateLocalPostgresString(),
          takenAtNaiveLocal: generateLocalNaivePostgresString(),
        })
          .then(() => {
            if (shouldRedirectToAdminPhotos) {
              router.push(pathForAdminUploadUrl(url));
            } else {
              onAddFinish?.(true);
              setIsAddingLocal(false);
            }
          })
          .catch(() => {
            onAddFinish?.(false);
            setIsAddingLocal(false);
          });
      }}
      isLoading={isAddingLocal}
      tooltip="Add directly"
      hideText="never"
    >
      Add
    </LoaderButton>
  );
}
