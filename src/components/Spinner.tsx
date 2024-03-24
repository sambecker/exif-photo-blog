import { clsx } from 'clsx/lite';

const SIZE_DEFAULT = 12;

export type SpinnerColor = 'text' | 'dim' | 'light-gray';

export default function Spinner({
  size = SIZE_DEFAULT,
  color = 'light-gray',
  className,
}: {
  size?: number
  color?: SpinnerColor
  className?: string
}) {
  return (
    <span
      className={clsx(
        className,
        color === 'light-gray' && 
          'text-gray-300 dark:text-gray-600',
        color === 'dim' &&
          'text-dim',
      )}
      style={{
        display: 'inline-flex',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth={SIZE_DEFAULT / size * 2}
        xmlns="http://www.w3.org/2000/svg"
        className="animate-rotate-pulse"
      >
        <path
          // eslint-disable-next-line max-len
          d="M11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11"
        />
      </svg>
    </span>
  );
}
