import clsx from 'clsx/lite';
import { FaInfo } from 'react-icons/fa';

export default function AdminAppInsightsIcon({
  notification = true,
}: {
  notification?: boolean,
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
      {notification && <span className={clsx(
        'absolute',
        'top-[0.5px] right-[-2.5px]',
        'size-2 rounded-full',
        'bg-blue-500',
      )} />}
    </span>
  );
}
