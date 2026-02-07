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
        'text-pink-500 dark:text-pink-400',
        'bg-pink-100 dark:bg-pink-800/35',
        'uppercase',
        className,
      )}>
      Experimental
    </Badge>
  );
}
