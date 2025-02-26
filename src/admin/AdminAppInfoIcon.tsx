import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { LuCog } from 'react-icons/lu';
import InsightsIndicatorDot from './insights/InsightsIndicatorDot';

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
        size={size === 'large' ? 20 : 17}
        className="inline-flex translate-y-[1px]"
        aria-label="App Info"
      />
      {insightIndicatorStatus &&
        <InsightsIndicatorDot
          size={size}
          top={size === 'large' ? 1.5 : 1.5}
          right={size === 'large' ? 0.5 : 1}
        />}
    </span>
  );
}
