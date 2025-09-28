import LoaderButton from '@/components/primitives/LoaderButton';
import { storeColorDataForPhotoAction, syncPhotoAction } from '@/photo/actions';
import IconGrSync from '@/components/icons/IconGrSync';
import { toastSuccess } from '@/toast';
import { ComponentProps, useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip';
import clsx from 'clsx/lite';
import useScrollIntoView from '@/utility/useScrollIntoView';
import { Photo } from '@/photo';
import { syncPhotoConfirmText } from './confirm';
import { isPhotoOnlyMissingColorData } from '@/photo/update';
import IconBroom from '@/components/icons/IconBroom';

export default function PhotoSyncButton({
  photo,
  onSyncComplete,
  updateMode,
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
  updateMode?: boolean
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

  const onlySyncColorData = updateMode &&
    isPhotoOnlyMissingColorData(photo);

  return (
    <Tooltip content={onlySyncColorData
      ? 'Update color data'
      : 'Regenerate photo data'}>
      <LoaderButton
        ref={ref}
        className={clsx(
          'scroll-mt-32',
          className,
        )}
        icon={updateMode
          ? <IconBroom size={18} />
          : <IconGrSync
            className="translate-y-[0.5px] translate-x-[0.5px]"
          />}
        onClick={() => {
          if (
            !shouldConfirm ||
            window.confirm(syncPhotoConfirmText(
              photo,
              hasAiTextGeneration,
              onlySyncColorData,
            ))
          ) {
            setIsSyncing(true);
            (onlySyncColorData
              ? storeColorDataForPhotoAction(photo.id)
              : syncPhotoAction(photo.id, { updateMode }))
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
