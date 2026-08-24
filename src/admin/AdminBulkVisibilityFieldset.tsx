'use client';

import { useState } from 'react';
import FieldsetWithStatus from '@/components/FieldsetWithStatus';
import {
  VISIBILITY_LABEL,
  VISIBILITY_OPTIONS,
  VisibilityValue,
} from '@/photo/visibility';
import { toastSuccess, toastWarning } from '@/toast';
import { useAppState } from '@/app/AppState';
import { useAppText } from '@/i18n/state/client';

export default function AdminBulkVisibilityFieldset({
  defaultLabel,
  getConfirmationText,
  action,
}: {
  defaultLabel: string
  getConfirmationText: (visibility: VisibilityValue) => string
  action: (visibility: VisibilityValue) => Promise<unknown>
}) {
  const { invalidateSwr } = useAppState();
  const appText = useAppText();

  const [visibility, setVisibility] = useState<VisibilityValue | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <FieldsetWithStatus
      label={VISIBILITY_LABEL}
      value={visibility}
      selectOptions={VISIBILITY_OPTIONS}
      selectOptionsDefaultLabel={defaultLabel}
      loading={isUpdating}
      readOnly={isUpdating}
      onChange={value => {
        const newVisibility = value as VisibilityValue;
        if (confirm(getConfirmationText(newVisibility))) {
          setVisibility(newVisibility);
          setIsUpdating(true);
          action(newVisibility)
            .then(() => {
              toastSuccess(appText.admin.setVisibilitySuccess);
              invalidateSwr?.();
            })
            .catch(() => {
              toastWarning(appText.admin.setVisibilityFailure);
              setVisibility('');
            })
            .finally(() => setIsUpdating(false));
        }
      }}
    />
  );
}
