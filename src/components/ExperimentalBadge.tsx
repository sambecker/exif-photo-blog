import { clsx } from 'clsx/lite';
import Badge from './Badge';

export default function ExperimentalBadge({
  className,
}: {
  className?: string
}) {
  return (
    <Badge
      type="small"
      className={clsx(
        'text-pink-500 dark:text-white',
        'bg-pink-100 dark:bg-pink-600',
        className,
      )}>
      Experimental
    </Badge>
  );
}
