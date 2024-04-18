'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { syncCacheAction } from '@/photo/actions';
import { useMoreComponentsState } from '@/state/MoreComponentsState';
import { BiTrash } from 'react-icons/bi';

export default function ClearCacheButton() {
  const {
    clearMoreComponentsState,
  } = useMoreComponentsState();

  return (
    <form action={syncCacheAction}>
      <SubmitButtonWithStatus
        icon={<BiTrash />}
        onFormSubmit={clearMoreComponentsState}
      >
        Clear Cache
      </SubmitButtonWithStatus>
    </form>
  );
}
