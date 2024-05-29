import { clsx } from 'clsx/lite';
import { Command } from 'cmdk';
import { ReactNode, useState } from 'react';
import Spinner from '../Spinner';

export default function CommandKItem({
  label,
  value,
  keywords,
  onSelect,
  accessory,
  annotation,
  annotationAria,
  showSpinner,
}: {
  label: string
  value: string
  keywords?: string[]
  onSelect: () => void
  accessory?: ReactNode
  annotation?: ReactNode
  annotationAria?: string
  showSpinner?: boolean
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Command.Item
      value={value}
      keywords={keywords}
      className={clsx (
        'px-2',
        accessory ? 'py-2' : 'py-1',
        'rounded-md cursor-pointer tracking-wide',
        'data-[selected=true]:bg-gray-100',
        'data-[selected=true]:dark:bg-gray-900/75',
        'active:!bg-gray-200/75 active:dark:!bg-gray-800/55',
      )}
      onSelect={() => {
        onSelect?.();
        if (showSpinner) {
          setIsLoading(true);
        }
      }}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        {accessory}
        <span className="grow text-ellipsis truncate">
          {label}
        </span>
        {annotation && !isLoading &&
          <span
            className="text-dim whitespace-nowrap"
            aria-label={annotationAria}
          >
            <span aria-hidden={Boolean(annotationAria)}>
              {annotation}
            </span>
          </span>}
        {isLoading &&
          <Spinner color="text" />}
      </div>
    </Command.Item>
  );
}
