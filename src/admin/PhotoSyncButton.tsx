import LoaderButton from '@/components/primitives/LoaderButton';
import { syncPhotoAction } from '@/photo/actions';
import IconGrSync from '@/components/icons/IconGrSync';
import { toastSuccess } from '@/toast';
import { ComponentProps, useRef, useState } from 'react';
import Tooltip from '@/components/Tooltip';
import clsx from 'clsx/lite';
import useScrollIntoView from '@/utility/useScrollIntoView';

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
  shouldScrollIntoViewOnExternalSync,
}: {
  photoId: string
  photoTitle?: string
  onSyncComplete?: () => void
  isSyncingExternal?: boolean
  hasAiTextGeneration?: boolean
  shouldConfirm?: boolean
  shouldToast?: boolean
  shouldScrollIntoViewOnExternalSync?: boolean
} & ComponentProps<typeof LoaderButton>) {
  const ref = useRef<HTMLButtonElement>(null);

  const [isSyncing, setIsSyncing] = useState(false);

  const confirmText = ['Overwrite'];
  if (photoTitle) { confirmText.push(`"${photoTitle}"`); }
  confirmText.push('data from original file?');
  if (hasAiTextGeneration) { confirmText.push(
    'AI text will be generated for undefined fields.'); }
  confirmText.push('This action cannot be undone.');

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
    </Tooltip>
  );
}
