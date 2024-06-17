import FormWithConfirm from '@/components/FormWithConfirm';
import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import IconGrSync from '@/site/IconGrSync';
import { clsx } from 'clsx/lite';
import { ComponentProps } from 'react';

export default function ExifSyncButton({
  action,
  label,
  onFormSubmit,
  photoUrl,
  className,
}: {
  action: (formData: FormData) => void
  label?: string
  photoUrl?: string
} & ComponentProps<typeof SubmitButtonWithStatus>) {
  return (
    <FormWithConfirm
      action={action}
      className={className}
    >
      <input name="photoUrl" value={photoUrl} hidden readOnly />
      <SubmitButtonWithStatus
        title="Update photo from original file"
        icon={<IconGrSync
          className={clsx(
            'translate-y-[0.5px] translate-x-[0.5px]',
            label && 'sm:translate-x-[-0.5px]',
          )} />}
        onFormSubmit={onFormSubmit}
      >
        {label}
      </SubmitButtonWithStatus>
    </FormWithConfirm>
  );
}
