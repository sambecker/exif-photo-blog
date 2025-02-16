import clsx from 'clsx/lite';
import { LuLightbulb } from 'react-icons/lu';

export default function AdminAppInsightsIcon({
  indicator,
}: {
  indicator?: 'blue' | 'yellow'
}) {
  return (
    <span className="inline-flex relative">
      <LuLightbulb
        size={19}
        className="translate-y-[3px]"
      />
      {indicator && <span className={clsx(
        'absolute',
        'top-[2px] right-[0.5px]',
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
