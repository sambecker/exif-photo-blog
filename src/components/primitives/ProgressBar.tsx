import { clsx } from 'clsx/lite';

const PROGRESS_PADDING = 0.1;

export default function ProgressBar({
  progress,
  className,
}: {
  progress?: number
  className?: string
}) {
  const progressPadded =
    PROGRESS_PADDING + (progress ?? 0) * (1 - PROGRESS_PADDING);

  return (
    <div className={clsx(
      'relative overflow-hidden',
      className,
    )}>
      <div
        style={{ transform: `scaleX(${progressPadded})` }}
        className={clsx(
          'absolute inset-0 origin-left',
          'transition-transform duration-300',
          'bg-invert',
          progress === undefined ? 'opacity-0' : 'opacity-100',
        )}
      />
    </div>
  );
}
