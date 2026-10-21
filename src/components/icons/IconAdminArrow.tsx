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
        d="M15.0087 18V8.40234L11.4316 11.5332C11.1199 11.8059 10.6458 11.7745 10.373 11.4629C10.1002 11.1512 10.1317 10.6771 10.4433 10.4043L15.2646 6.18555L15.3769 6.10449C15.651 5.94203 16.0054 5.96901 16.2529 6.18555L21.0741 10.4043C21.3859 10.6771 21.4172 11.1512 21.1445 11.4629C20.8717 11.7743 20.3985 11.8056 20.0868 11.5332L16.5087 8.40234V18C16.5087 18.4142 16.1729 18.75 15.7587 18.75C15.3446 18.7499 15.0087 18.4142 15.0087 18Z"
        fill="currentColor"
      />
    </svg>
  );
}
