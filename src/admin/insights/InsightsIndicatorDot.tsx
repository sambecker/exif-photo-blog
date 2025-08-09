import { useAppState } from '@/app/AppState';
import clsx from 'clsx/lite';
import { FaCircle } from 'react-icons/fa6';

export default function InsightsIndicatorDot({
  className,
  size = 'medium',
  colorOverride,
  top,
  right,
  bottom,
  left,
}: {
  className?: string
  size?: 'small' | 'medium' | 'large'
  colorOverride?: 'blue' | 'yellow'
  top?: number
  right?: number
  bottom?: number
  left?: number
}) {
  const { insightsIndicatorStatus } = useAppState();

  const getSize = () => {
    switch (size) {
      case 'small': return 6;
      case 'medium': return 7;
      case 'large': return 8;
    }
  };

  return (
    <FaCircle
      size={getSize()}
      className={clsx(
        (
          top !== undefined ||
          right !== undefined ||
          bottom !== undefined ||
          left !== undefined
        ) && 'absolute',
        (colorOverride ?? insightsIndicatorStatus) === 'blue'
          ? 'text-blue-500'
          : 'text-amber-500',
        className,
      )}
      style={{ top, right, bottom, left }}
    />
  );
}
