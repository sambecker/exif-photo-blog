import clsx from 'clsx/lite';

const INTRINSIC_WIDTH = 28;
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
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={clsx(
        'shrink-0',
        direction === 'down' && 'rotate-180',
        className,
      )}
    >
      <path
        d="M10 11.4688L14.2188 7.25L18.4375 11.4688M14.2188 7.83594V16.8203"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
