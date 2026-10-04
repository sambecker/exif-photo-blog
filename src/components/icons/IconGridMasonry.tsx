/* eslint-disable @stylistic/max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconGridMasonry({
  width = INTRINSIC_WIDTH,
  className,
}: {
  width?: number
  className?: string
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="0.625" y="-0.625" width="16.75" height="10.75" rx="2.375" transform="matrix(1 0 0 -1 5 16.75)" strokeWidth="1.25"/>
      <line y1="-0.625" x2="11" y2="-0.625" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 10.75 17)" strokeWidth="1.25"/>
      <line y1="-0.625" x2="11" y2="-0.625" transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 16.25 17)" strokeWidth="1.25"/>
      <path d="M5 11L11.5 11" strokeWidth="1.25"/>
      <path d="M11 13.5L17.5 13.5" strokeWidth="1.25"/>
      <path d="M17 11H22.5" strokeWidth="1.25"/>
    </svg>
  );
};
