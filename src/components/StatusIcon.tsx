import {
  BiSolidCheckboxChecked,
  BiSolidCheckboxMinus,
  BiSolidXSquare,
} from 'react-icons/bi';
import Spinner from './Spinner';
import clsx from 'clsx/lite';

export default function StatusIcon({
  type,
  loading,
  className,
}: {
  type: 'checked' | 'missing' | 'warning' | 'optional'
  loading?: boolean
  className?: string
}) {
  const getIcon = () => {
    switch (type) {
      case 'checked':
        return <BiSolidCheckboxChecked
          size={18}
          className="text-green-400"
        />;
      case 'missing':
        return <BiSolidXSquare
          size={14.5}
          className="text-red-400"
        />;
      case 'warning':
        return <BiSolidXSquare
          size={14.5}
          className="text-amber-500"
        />;
      case 'optional':
        return <BiSolidCheckboxMinus
          size={18}
          className="text-dim"
        />;
    }
  };

  return (
    <span className={clsx(
      'size-[16px]',
      'inline-flex items-center justify-center',
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
