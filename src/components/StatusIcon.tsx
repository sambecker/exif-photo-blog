import Spinner from './Spinner';
import clsx from 'clsx/lite';
import { FaTimes, FaMinus, FaCheck } from 'react-icons/fa';

export default function StatusIcon({
  type,
  loading,
  className,
}: {
  type: 'checked' | 'missing' | 'warning' | 'optional'
  loading?: boolean
  className?: string
}) {
  const getBgColor = () => {
    switch (type) {
      case 'checked':
        return 'bg-green-500 dark:bg-green-600';
      case 'missing':
        return 'bg-red-400 dark:bg-red-500';
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-600';
      case 'optional':
        return 'bg-gray-300 dark:bg-gray-700';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'checked':
        return <FaCheck
          size={8}
          className="text-white"
        />;
      case 'missing':
      case 'warning':
        return <FaTimes
          size={9}
          className="text-white"
        />;
      case 'optional':
        return <FaMinus
          size={9}
          className="text-white"
        />;
    }
  };

  return (
    <span className={clsx(
      'size-[14px] rounded-[5px] overflow-hidden',
      'inline-flex items-center justify-center',
      !loading && getBgColor(),
      className,
    )}>
      {loading
        ? <span className="translate-y-[1px]">
          <Spinner size={12} />
        </span>
        : <span>
          {getIcon()}
        </span>}
    </span>
  );
}
