import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { FaCircle } from 'react-icons/fa6';
import { LuCog } from 'react-icons/lu';

export default function AdminAppInfoIcon({
  size = 'large',
  className,
}: {
  size?: 'small' | 'large'
  className?: string
}) {
  const { insightIndicatorStatus } = useAppState();

  return (
    <span className={clsx(
      'inline-flex relative',
      className,
    )}>
      <LuCog
        size={size === 'large' ? 20 : 18}
        className="inline-flex translate-y-[1px]"
        aria-label="App Info"
      />
      {insightIndicatorStatus &&
        <FaCircle
          size={size === 'large' ? 8 : 7}
          className={clsx(
            'absolute',
            size === 'large'
              ? 'top-[1.5px] right-[0.5px]'
              : 'top-[1px] right-[-0.5px]',
            insightIndicatorStatus === 'blue'
              ? 'text-blue-500'
              : 'text-amber-500',
          )}
        />}
    </span>
  );
}
