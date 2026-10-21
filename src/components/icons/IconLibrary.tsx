/* eslint-disable @stylistic/max-len */

import clsx from 'clsx/lite';

const INTRINSIC_WIDTH = 32;
const INTRINSIC_HEIGHT = 24;

export default function IconLibrary({
  width = INTRINSIC_WIDTH,
  className,
  selected,
}: {
  width?: number
  className?: string
  selected?: boolean
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 32 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.55695 10.0841V17.3214C6.55695 17.7082 6.73258 18.0792 7.0452 18.3528C7.35782 18.6263 7.78183 18.78 8.22394 18.78H23.7761C24.2182 18.78 24.6422 18.6263 24.9548 18.3528C25.2674 18.0792 25.4431 17.7082 25.4431 17.3214V10.0841M6.55695 10.0841V7.45862C6.55695 7.07177 6.73258 6.70077 7.0452 6.42722C7.35782 6.15368 7.78183 6 8.22394 6H11.3867C11.7158 6.00001 12.0376 6.08527 12.3114 6.24505L13.4717 6.92185C13.7455 7.08163 14.0673 7.16689 14.3964 7.1669H23.7761C24.2182 7.1669 24.6422 7.32057 24.9548 7.59412C25.2674 7.86766 25.4431 8.23867 25.4431 8.62552V10.0841M6.55695 10.0841H25.4431"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx(selected && 'fill-medium')}
      />
    </svg>
  );
}
