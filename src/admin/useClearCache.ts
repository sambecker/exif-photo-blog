'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState } from '@/app/AppState';
import { useAppText } from '@/i18n/state/client';
import { clearCacheAction } from '@/photo/actions';
import { toastSuccess } from '@/toast';

export default function useClearCache() {
  const { invalidateSwr } = useAppState();
  const appText = useAppText();
  const router = useRouter();

  return useCallback(() => {
    if (confirm(appText.admin.clearCacheConfirm)) {
      return clearCacheAction().then(() => {
        invalidateSwr?.();
        toastSuccess(appText.admin.clearCacheSuccess);
        router.refresh();
      });
    }
  }, [
    appText.admin.clearCacheConfirm,
    appText.admin.clearCacheSuccess,
    invalidateSwr,
    router,
  ]);
}
