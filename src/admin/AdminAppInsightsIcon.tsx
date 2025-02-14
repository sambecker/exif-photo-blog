import clsx from 'clsx/lite';
import { FaInfo } from 'react-icons/fa';

export default function AdminAppInsightsIcon({
  indicator = 'blue',
}: {
  indicator?: 'blue' | 'yellow'
}) {
  return (
    <span className="inline-flex relative">
      <span className={clsx(
        'size-[16px]',
        'inline-flex items-center justify-center',
        'border-[1.5px] border-current rounded-[6px]',
        'translate-y-[3px]',
      )}>
        <FaInfo
          size={8}
          aria-label="App Configuration"
        />
      </span>
      {indicator && <span className={clsx(
        'absolute',
        'top-[0.5px] right-[-2.5px]',
        'size-2 rounded-full',
        indicator === 'yellow'
          ? 'bg-amber-500'
          : indicator === 'blue'
            ? 'bg-blue-500'
            : undefined,
      )} />}
    </span>
  );
}
