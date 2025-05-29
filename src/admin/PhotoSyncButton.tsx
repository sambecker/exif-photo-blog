import LoaderButton from '@/components/primitives/LoaderButton';
import { syncPhotoAction } from '@/photo/actions';
import IconGrSync from '@/components/icons/IconGrSync';
import { toastSuccess } from '@/toast';
import { ComponentProps, useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip';
import clsx from 'clsx/lite';
import useScrollIntoView from '@/utility/useScrollIntoView';
import { Photo } from '@/photo';
import { syncPhotoConfirmText } from './confirm';

export default function PhotoSyncButton({
  photo,
  onSyncComplete,
  className,
  isSyncingExternal,
  hasAiTextGeneration,
  disabled,
  shouldConfirm,
  shouldToast,
  shouldScrollIntoViewOnExternalSync,
}: {
  photo: Photo
  onSyncComplete?: () => void
  isSyncingExternal?: boolean
  hasAiTextGeneration: boolean
  shouldConfirm?: boolean
  shouldToast?: boolean
  shouldScrollIntoViewOnExternalSync?: boolean
} & ComponentProps<typeof LoaderButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  const [isSyncing, setIsSyncing] = useState(false);

  useScrollIntoView({
    ref,
    shouldScrollIntoView:
      isSyncingExternal &&
      shouldScrollIntoViewOnExternalSync,
  });

  return (
    <Tooltip content="Regenerate photo data">
      <LoaderButton
        ref={ref}
        className={clsx('scroll-mt-8', className)}
        icon={<IconGrSync
          className="translate-y-[0.5px] translate-x-[0.5px]"
        />}
        onClick={() => {
          if (
            !shouldConfirm ||
            window.confirm(syncPhotoConfirmText(photo, hasAiTextGeneration))
          ) {
            setIsSyncing(true);
            syncPhotoAction(photo.id)
              .then(() => {
                onSyncComplete?.();
                if (shouldToast) {
                  toastSuccess(photo.title
                    ? `"${photo.title}" data synced`
                    : 'Data synced');
                }
              })
              .finally(() => setIsSyncing(false));
          }
        }}
        isLoading={isSyncing || isSyncingExternal}
        disabled={disabled}
      />
    </Tooltip>
  );
}
