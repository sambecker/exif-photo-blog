import FormWithConfirm from '@/components/FormWithConfirm';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import IconGrSync from '@/site/IconGrSync';
import { clsx } from 'clsx/lite';
import { ComponentProps } from 'react';

export default function PhotoSyncButton({
  action,
  label,
  onFormSubmit,
  formData: { photoId, photoUrl } = {},
  photoTitle,
  hasAiTextGeneration,
  shouldConfirm,
  shouldToast,
}: {
  action: (formData: FormData) => void
  label?: string
  formData?: {
    photoId?: string
    photoUrl?: string
  }
  photoTitle?: string
  hasAiTextGeneration?: boolean
  shouldConfirm?: boolean
  shouldToast?: boolean
} & ComponentProps<typeof SubmitButtonWithStatus>) {
  const confirmText = ['Overwrite'];
  if (photoTitle) { confirmText.push(`"${photoTitle}"`); }
  confirmText.push('data from original file?');
  if (hasAiTextGeneration) { confirmText.push(
    'This will also auto-generate AI text for undefined fields.'); }
  confirmText.push('This action cannot be undone.');
  return (
    <FormWithConfirm
      action={action}
      confirmText={shouldConfirm ? confirmText.join(' ') : undefined}
    >
      {photoId && 
        <input name="photoId" value={photoId} hidden readOnly />}
      {photoUrl && 
        <input name="photoUrl" value={photoUrl} hidden readOnly />}
      <SubmitButtonWithStatus
        title="Update photo from original file"
        icon={<IconGrSync
          className={clsx(
            'translate-y-[0.5px] translate-x-[0.5px]',
            label && 'sm:translate-x-[-0.5px]',
          )} />}
        onFormSubmitToastMessage={shouldToast
          ? photoTitle
            ? `"${photoTitle}" data synced`
            : 'Data synced'
          : undefined}
        onFormSubmit={onFormSubmit}
      >
        {label}
      </SubmitButtonWithStatus>
    </FormWithConfirm>
  );
}
