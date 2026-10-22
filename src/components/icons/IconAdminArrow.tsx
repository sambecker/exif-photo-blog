/* eslint-disable @stylistic/max-len */

import clsx from 'clsx/lite';

const INTRINSIC_WIDTH = 32;
const INTRINSIC_HEIGHT = 24;

export default function IconAdminArrow({
  width = INTRINSIC_WIDTH,
  className,
  direction = 'up',
}: {
  width?: number
  className?: string
  direction?: 'up' | 'down'
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'shrink-0',
        direction === 'down' && 'rotate-180',
        className,
      )}
    >
      <path
        d="M9.94 11.07L15.7588 5.84909L21.58 11.07M15.7588 6.43503V18.0991"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
