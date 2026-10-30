'use client';

import { clsx } from 'clsx/lite';
import SimpleCheckbox from './primitives/SimpleCheckbox';
import Spinner from './Spinner';
import { useSelectPhotosState } from '@/admin/select/SelectPhotosState';

export default function SelectTileOverlay({
  isSelected,
  onSelectChange,
}: {
  isSelected: boolean
  onSelectChange: () => void
}) {
  const { isPerformingSelectEdit } = useSelectPhotosState();

  return (
    <div className={clsx(
      // Pin to the photo frame. Checkbox is positioned on this box,
      // not the bordered layer, so selecting doesn't move it.
      'absolute inset-0 z-10',
      isPerformingSelectEdit && 'pointer-events-none',
    )}>
      <div className={clsx(
        'absolute inset-0 overflow-hidden rounded-sm',
        'active:bg-gray-950/40 dark:active:bg-gray-950/60',
        isSelected && 'border-4 border-blue-600',
      )}>
        {/* Admin Select Border */}
        <button
          type="button"
          aria-label={isSelected ? 'Deselect photo' : 'Select photo'}
          className={clsx(
            'absolute inset-0 cursor-pointer',
            'border-none shadow-none p-0 rounded-none bg-transparent',
          )}
          onClick={onSelectChange}
        >
          <div
            className={clsx(
              'w-full h-full',
              // eslint-disable-next-line @stylistic/max-len
              'bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,rgba(1,0,0,0.40)_0%,rgba(255,255,255,0.00)_75%)]',
            )}
          />
        </button>
      </div>
      {/* Admin Select Action */}
      <div className="absolute top-0 right-0 z-10 p-2">
        {isPerformingSelectEdit
          ? isSelected
            ? <Spinner
              size={16}
              color="text"
              className="m-[1px]"
            />
            : null
          : <SimpleCheckbox
            className={clsx(
              'text-white',
              // Required to prevent Safari jitter
              'translate-x-[0.1px]',
            )}
            checked={isSelected}
            onChange={onSelectChange}
          />}
      </div>
    </div>
  );
}
