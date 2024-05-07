import { clsx } from 'clsx/lite';
import { FiRotateCcw } from 'react-icons/fi';
import { getImageBlurAction } from './actions';
import { useState } from 'react';
import Spinner from '@/components/Spinner';

export default function UpdateBlurDataButton({
  photoUrl,
  onUpdatedBlurData,
}: {
  photoUrl?: string
  onUpdatedBlurData: (blurData: string) => void
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      type="button"
      className={clsx(
        'flex min-w-[3.25rem] min-h-9 justify-center',
        'h-full',
      )}
      disabled={!photoUrl || isLoading}
      onClick={() => {
        if (photoUrl) {
          setIsLoading(true);
          getImageBlurAction(photoUrl)
            .then(blurData => onUpdatedBlurData(blurData))
            .finally(() => setIsLoading(false));
        }
      }}
    >
      {isLoading ? <Spinner /> : <FiRotateCcw size={18} />}
    </button>
  );
}
