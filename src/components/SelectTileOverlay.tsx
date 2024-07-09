import { clsx } from 'clsx/lite';
import Checkbox from './primitives/Checkbox';

export default function SelectTileOverlay({
  isSelected,
  onSelectChange,
}: {
  isSelected: boolean
  onSelectChange: () => void
}) {
  return (
    <>
      {/* Admin Select Border */}
      <div className={clsx(
        'absolute w-full h-full pointer-events-none',
      )}>
        <div
          className={clsx(
            'w-full h-full',
            'border-black dark:border-white',
            'transition-opacity',
            !isSelected && 'opacity-0',
            'group-hover:opacity-100',
            // eslint-disable-next-line max-len
            'bg-[radial-gradient(169.40%_89.55%_at_94.76%_6.29%,rgba(1,0,0,0.40)_0%,rgba(255,255,255,0.00)_75%)]',
            isSelected && 'border-4',
          )}
        />
      </div>
      {/* Admin Select Action */}
      <div className="absolute top-0 right-0 p-2">
        <Checkbox
          className={clsx(
            'text-white',
            !isSelected && 'opacity-0 group-hover:opacity-100',
            // Required to prevent Safari jitter
            'translate-x-[0.1px]',
          )}
          checked={isSelected}
          onChange={onSelectChange}
        />
      </div>
    </>
  );
}
