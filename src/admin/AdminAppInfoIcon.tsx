import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { FaCircle } from 'react-icons/fa6';
import { LuCog } from 'react-icons/lu';

export default function AdminAppInfoIcon({
  className,
}: {
  className?: string
}) {
  const { insightIndicatorStatus } = useAppState();

  return (
    <span className={clsx(
      'inline-flex relative',
      className,
    )}>
      <LuCog
        size={20}
        className="inline-flex translate-y-[1px]"
        aria-label="App Info"
      />
      {insightIndicatorStatus &&
        <FaCircle
          size={8}
          className={clsx(
            'absolute',
            'top-[2px] right-[0.5px]',
            insightIndicatorStatus === 'blue'
              ? 'text-blue-500'
              : 'text-amber-500',
          )}
        />}
    </span>
  );
}
