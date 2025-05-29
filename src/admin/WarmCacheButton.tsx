'use client';

import SubmitButtonWithStatus from '@/components/SubmitButtonWithStatus';
import { warmUpPhotoCacheAction } from './actions';
import { toastSuccess } from '@/toast';

export default function WarmCacheButton() {
  return (
    <form
      action={async () => {
        await warmUpPhotoCacheAction();
        toastSuccess('Cache warmed up successfully');
      }}
    >
      <SubmitButtonWithStatus>
        Warm Redis Cache
      </SubmitButtonWithStatus>
    </form>
  );
}