'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { clearCacheAction } from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { BiTrash } from 'react-icons/bi';

export default function ClearCacheButton() {
  const { invalidateSwr } = useAppState();

  return (
    <form action={clearCacheAction}>
      <SubmitButtonWithStatus
        icon={<BiTrash size={16} />}
        hideText="never"
        onFormSubmit={invalidateSwr}
      >
        Clear Cache
      </SubmitButtonWithStatus>
    </form>
  );
}
