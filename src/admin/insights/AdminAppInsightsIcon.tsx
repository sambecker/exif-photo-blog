import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { LuLightbulb } from 'react-icons/lu';

export default function AdminAppInsightsIcon() {
  const {
    insightIndicatorStatus,
  } = useAppState();
  
  return (
    <span className="inline-flex relative">
      <LuLightbulb
        size={19}
        className="translate-y-[3px]"
      />
      {insightIndicatorStatus && <span className={clsx(
        'absolute',
        'top-[2px] right-[0.5px]',
        'size-2 rounded-full',
        insightIndicatorStatus === 'blue'
          ? 'bg-blue-500'
          : 'bg-amber-500',
      )} />}
    </span>
  );
}
