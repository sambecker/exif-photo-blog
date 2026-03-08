'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { clearCacheAction } from '@/photo/actions';
import { useAppState } from '@/app/AppState';
import { BiTrash } from 'react-icons/bi';
import { useAppText } from '@/i18n/state/client';
import { toastSuccess } from '@/toast';

export default function ClearCacheButton() {
  const { invalidateSwr } = useAppState();
  const appText = useAppText();

  return (
    <form action={clearCacheAction}>
      <SubmitButtonWithStatus
        icon={<BiTrash size={16} />}
        hideText="never"
        onFormSubmit={() => {
          invalidateSwr?.();
          toastSuccess(appText.admin.clearCacheSuccess);
        }}
      >
        {appText.admin.clearCache}
      </SubmitButtonWithStatus>
    </form>
  );
}
