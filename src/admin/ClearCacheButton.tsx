'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { syncCacheAction } from '@/photo/actions';
import { useAppState } from '@/state/AppState';
import { BiTrash } from 'react-icons/bi';

export default function ClearCacheButton() {
  const { invalidateSwr } = useAppState();

  return (
    <form action={syncCacheAction}>
      <SubmitButtonWithStatus
        icon={<BiTrash size={16} />}
        onFormSubmit={invalidateSwr}
      >
        Clear Cache
      </SubmitButtonWithStatus>
    </form>
  );
}
