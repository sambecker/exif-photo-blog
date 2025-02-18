import LoaderButton from '@/components/primitives/LoaderButton';
import { syncPhotoAction } from '@/photo/actions';
import IconGrSync from '@/app/IconGrSync';
import { toastSuccess } from '@/toast';
import { ComponentProps, useState } from 'react';

export default function PhotoSyncButton({
  photoId,
  photoTitle,
  onSyncComplete,
  className,
  isSyncingExternal,
  hasAiTextGeneration,
  disabled,
  shouldConfirm,
  shouldToast,
}: {
  photoId: string
  photoTitle?: string
  onSyncComplete?: () => void
  isSyncingExternal?: boolean
  hasAiTextGeneration?: boolean
  shouldConfirm?: boolean
  shouldToast?: boolean
} & ComponentProps<typeof LoaderButton>) {
  const [isSyncing, setIsSyncing] = useState(false);

  const confirmText = ['Overwrite'];
  if (photoTitle) { confirmText.push(`"${photoTitle}"`); }
  confirmText.push('data from original file?');
  if (hasAiTextGeneration) { confirmText.push(
    'AI text will be generated for undefined fields.'); }
  confirmText.push('This action cannot be undone.');

  return (
    <LoaderButton
      title="Update photo from original file"
      className={className}
      icon={<IconGrSync
        className="translate-y-[0.5px] translate-x-[0.5px]"
      />}
      onClick={() => {
        if (!shouldConfirm || window.confirm(confirmText.join(' '))) {
          setIsSyncing(true);
          syncPhotoAction(photoId)
            .then(() => {
              onSyncComplete?.();
              if (shouldToast) {
                toastSuccess(photoTitle
                  ? `"${photoTitle}" data synced`
                  : 'Data synced');
              }
            })
            .finally(() => setIsSyncing(false));
        }
      }}
      isLoading={isSyncing || isSyncingExternal}
      disabled={disabled}
    />
  );
}
