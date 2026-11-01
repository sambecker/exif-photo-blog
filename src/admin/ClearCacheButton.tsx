'use client';

import LoaderButton from '@/components/primitives/LoaderButton';
import { BiTrash } from 'react-icons/bi';
import { useAppText } from '@/i18n/state/client';
import { useState } from 'react';
import useClearCache from './useClearCache';

export default function ClearCacheButton() {
  const appText = useAppText();
  const clearCache = useClearCache();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderButton
      icon={<BiTrash size={16} />}
      hideText="never"
      isLoading={isLoading}
      onClick={() => {
        const result = clearCache();
        if (result) {
          setIsLoading(true);
          result.finally(() => setIsLoading(false));
        }
      }}
    >
      {appText.admin.clearCache}
    </LoaderButton>
  );
}
