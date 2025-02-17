import { useAppState } from '@/state/AppState';
import clsx from 'clsx/lite';
import { LuLightbulb } from 'react-icons/lu';

export default function AdminAppInsightsIcon() {
  const {
    shouldShowInsightsIndicator,
  } = useAppState();
  
  return (
    <span className="inline-flex relative">
      <LuLightbulb
        size={19}
        className="translate-y-[3px]"
      />
      {shouldShowInsightsIndicator && <span className={clsx(
        'absolute',
        'top-[2px] right-[0.5px]',
        'size-2 rounded-full',
        'bg-blue-500',
      )} />}
    </span>
  );
}
