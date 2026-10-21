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
        d="M6.55695 9.58414V16.8214C6.55695 17.2082 6.73258 17.5792 7.0452 17.8528C7.35782 18.1263 7.78183 18.28 8.22394 18.28H23.7761C24.2182 18.28 24.6422 18.1263 24.9548 17.8528C25.2674 17.5792 25.4431 17.2082 25.4431 16.8214V9.58414M6.55695 9.58414V6.95862C6.55695 6.57177 6.73258 6.20077 7.0452 5.92722C7.35782 5.65368 7.78183 5.5 8.22394 5.5H11.3867C11.7158 5.50001 12.0376 5.58527 12.3114 5.74505L13.4717 6.42185C13.7455 6.58163 14.0673 6.66689 14.3964 6.6669H23.7761C24.2182 6.6669 24.6422 6.82057 24.9548 7.09412C25.2674 7.36766 25.4431 7.73867 25.4431 8.12552V9.58414M6.55695 9.58414H25.4431"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx(selected && 'fill-medium')}
      />
    </svg>
  );
}
