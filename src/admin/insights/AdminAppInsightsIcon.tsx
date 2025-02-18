import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { LuLightbulb } from 'react-icons/lu';
import { FaCircle } from 'react-icons/fa6';
export default function AdminAppInsightsIcon() {
  const {
    insightIndicatorStatus,
  } = useAppState();
  
  return (
    <span className="inline-flex relative">
      <LuLightbulb
        size={18}
        className="translate-y-[3.5px]"
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
