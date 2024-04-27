'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { syncCacheAction } from '@/photo/actions';
import { BiTrash } from 'react-icons/bi';

export default function ClearCacheButton() {
  return (
    <form action={syncCacheAction}>
      <SubmitButtonWithStatus
        icon={<BiTrash />}
      >
        Clear Cache
      </SubmitButtonWithStatus>
    </form>
  );
}
